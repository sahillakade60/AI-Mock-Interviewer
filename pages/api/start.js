// File: /pages/api/start.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Always return "Introduce yourself" as the first question
  return res.status(200).json({ question: "Introduce yourself." });
}
