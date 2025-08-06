import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

export default function Home() {
  const [jobRole, setJobRole] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [listening, setListening] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const recognitionRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const finalTranscriptRef = useRef("");

  const totalQuestions = 5;

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        clearTimeout(inactivityTimerRef.current);
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setAnswer((finalTranscriptRef.current + interimTranscript).trim());

        inactivityTimerRef.current = setTimeout(() => {
          stopListening();
          handleSubmitAnswer();
        }, 10000); // 10s silence = auto submit
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
        clearTimeout(inactivityTimerRef.current);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const startInterview = async () => {
    const res = await fetch("/api/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: jobRole }),
    });

    const data = await res.json();
    setQuestion(data.question);
    setInterviewStarted(true);
    setQuestionCount(1);
    speak(data.question);
    setTimeout(() => startListening(), 500); // slight delay to avoid conflicts
  };

  const startListening = () => {
    if (!recognitionRef.current) return;

    setAnswer("");
    finalTranscriptRef.current = "";
    setListening(true);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Recognition start failed:", error.message);
      setListening(false);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !listening) return;
    recognitionRef.current.stop();
    setListening(false);
    clearTimeout(inactivityTimerRef.current);
  };

  const handleSubmitAnswer = async () => {
    stopListening();

    const finalAnswer = finalTranscriptRef.current.trim();
    if (!finalAnswer) return;

    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: jobRole, answer: finalAnswer }),
    });

    const data = await res.json();
    setFeedbacks((prev) => [...prev, data.feedback]);
    setAnswer("");
    finalTranscriptRef.current = "";

    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);

    if (nextCount <= totalQuestions) {
      setQuestion(data.question);
      speak(data.question);
      setTimeout(() => startListening(), 500);
    } else {
      setQuestion("Interview completed. 🎉");
    }
  };

  return (
    <>
      <Head>
        <title>AI Mock Interviewer</title>
      </Head>
      <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          🎤 AI Mock Interviewer
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2 flex justify-center">
            <Webcam className="rounded-lg border border-gray-700 w-full h-[400px]" />
          </div>

          <div className="w-full lg:w-1/2 space-y-4">
            {!interviewStarted && (
              <>
                <input
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600"
                  type="text"
                  placeholder="Enter Job Role"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                />
                <button
                  onClick={startInterview}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 w-full"
                >
                  🚀 Start Interview
                </button>
              </>
            )}

            {interviewStarted && (
              <>
                <div className="p-4 bg-gray-800 rounded border border-gray-700">
                  <p className="text-lg font-semibold">Question:</p>
                  <p>{question}</p>
                </div>

                <textarea
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600"
                  placeholder="Your spoken answer will appear here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={4}
                ></textarea>

                <div className="flex gap-4">
                  <button
                    onClick={handleSubmitAnswer}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    ✅ Submit Answer
                  </button>
                  <button
                    onClick={startListening}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800"
                  >
                    🎙️ Retry Speaking
                  </button>
                </div>
              </>
            )}

            {questionCount > totalQuestions && (
              <div className="p-4 bg-gray-900 rounded border border-green-600 mt-6">
                <p className="text-xl font-bold mb-2">📝 Final Feedback:</p>
                {feedbacks.map((fb, idx) => (
                  <p key={idx} className="mb-1">🔹 {fb}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
