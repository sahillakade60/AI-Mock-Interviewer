# 🤖 AI Mock Interviewer

AI Mock Interviewer is a smart web app that simulates a real-time interview experience. It uses AI to ask role-based questions, listens to your answers via mic, shows your video, gives feedback, and helps you practice for real interviews confidently.

## 🚀 Features

- 🎤 **Speech-to-Text**: Converts your spoken answers into text automatically.
- 🎥 **Webcam Support**: Live camera preview for realistic interview simulation.
- 🧠 **AI-Driven Questions**: Role-based dynamic questions using Groq/OpenAI API.
- ⏱️ **Auto Submission**: Automatically submits answer after 10 seconds of silence.
- 📝 **AI Feedback**: Gives instant feedback + follow-up question after each answer.
- 🔟 **10 Questions Total**: Interview ends after 10 questions with a final summary.

## 🛠️ Tech Stack

- **Frontend**: Next.js (Pages Router) + Tailwind CSS
- **Backend**: API Routes in Next.js
- **AI**: Groq API (uses OpenAI models)
- **Mic & Camera**: `webkitSpeechRecognition` + `navigator.mediaDevices.getUserMedia`

## 📁 Project Structure

```
ai-mock-interviewer/
│
├── pages/
│   ├── api/
│   │   ├── start.js          # Starts the interview with the first question
│   │   ├── interview.js      # Handles answers, gives feedback & next question
│   │   └── feedback.js       # Final feedback after 10 questions
│   └── interview.js          # Main frontend page with mic, camera, flow
│
├── public/                   # Static assets
├── styles/                  # Global styles
├── .env.example             # Sample environment file
└── README.md                # Project documentation
```

## 🧪 How It Works

1. **Start Interview** ➝ The app asks "Introduce yourself".
2. **Speak Your Answer** ➝ Mic records and converts to text.
3. **AI Responds** ➝ Gives feedback + follow-up question.
4. **Repeats for 10 questions** ➝ Then final feedback is shown.

## 🔐 Environment Variables

Rename `.env.example` to `.env.local` and set your keys:

```
GROQ_API_KEY=your-real-api-key-here
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 🧑‍💻 Getting Started (Local Setup)

```bash
git clone https://github.com/sahillakade60/AI-Mock-Interviewer.git
cd AI-Mock-Interviewer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000/interview` in your browser.

## 📦 Deployment

You can deploy this project to:

- **Vercel** (best for Next.js)
- **Netlify**
- **Render**

Just make sure to set the same environment variables in their dashboard.

## 📸 Demo Preview

> 🎬 (You can add a link here later to a YouTube or Loom demo)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙌 Acknowledgements

- [Groq](https://console.groq.com/) for lightning-fast OpenAI-compatible inference.
- [OpenAI](https://platform.openai.com/) for powerful language models.
- Inspired by real-world interview prep needs of developers and students.
