import { useEffect, useState } from "react";

export default function InterviewPage() {
  const [userInput, setUserInput] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    let finalTranscript = "";
    let inactivityTimer;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      clearTimeout(inactivityTimer); // Reset 10s timer

      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setUserInput(finalTranscript + interimTranscript);

      // ⏳ Restart 10s silence timer
      inactivityTimer = setTimeout(() => {
        recognition.stop();
        const fullAnswer = finalTranscript.trim();
        setUserAnswer(fullAnswer);
        setIsRecording(false);
        handleNextStep(fullAnswer);
      }, 10000);
    };

    // Start speech when interview starts
    if (isRecording) {
      recognition.start();
    }

    return () => {
      recognition.stop();
      clearTimeout(inactivityTimer);
    };
  }, [isRecording]);

  // 🧠 This function triggers the next question
  const handleNextStep = async (answer) => {
    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    const data = await res.json();
    console.log("Next Question:", data.question);
    // Set next question here...
  };

  return (
    <div className="p-6">
      <button onClick={() => setIsRecording(true)}>🎤 Start Speaking</button>
      <p className="mt-4">Your input: {userInput}</p>
      <p className="mt-4">Final answer: {userAnswer}</p>
    </div>
  );
}
