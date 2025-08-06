// /pages/api/feedback.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { role, allAnswers } = req.body;

  const joinedAnswers = allAnswers
    .map((ans, i) => `Q${i + 1}: ${ans}`)
    .join('\n');

  const prompt = `You are a professional interviewer. The candidate applied for ${role}. Here are their answers:\n${joinedAnswers}\n\nGive a detailed, helpful feedback with strengths and areas to improve.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const feedback = response.choices[0].message.content.trim();
    res.status(200).json({ feedback });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
