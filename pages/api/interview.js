// File: /pages/api/interview.js

import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const chat = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-8b-8192",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { role, answer } = req.body;

  const prompt = answer
    ? `You are an interviewer for a ${role} position. The candidate answered: "${answer}". Provide brief feedback and then ask the next question. Start the next question with 'Next Question:'`
    : `Start a mock interview for a ${role} role. Begin with the first question. Start the question with 'Next Question:'`;

  try {
    const response = await chat.call([
      new SystemMessage("You are a professional interviewer. Always be concise."),
      new HumanMessage(prompt),
    ]);

    const text = response.content;
    const splitIndex = text.indexOf("Next Question:");

    let feedback = "";
    let nextQuestion = "";

    if (splitIndex !== -1) {
      feedback = text.slice(0, splitIndex).trim();
      nextQuestion = text.slice(splitIndex + 14).trim();
    } else {
      // fallback if AI didn’t follow instruction
      feedback = text.trim();
      nextQuestion = "That was the last question.";
    }

    res.status(200).json({ feedback, question: nextQuestion });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to fetch interview response" });
  }
}
