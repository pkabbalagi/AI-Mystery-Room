<div align="center">

# 🕵️ AI Mystery Room

**Generate a fully playable, AI-powered escape-room mystery in seconds.**

Enter a theme and difficulty — Gemini creates an original story with rooms, clues, puzzles, and a final solution.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-Backend-000000?logo=express&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini_API-4285F4?logo=google&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?logo=zod&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-yellow)

</div>

---

## ✨ Overview

**AI Mystery Room** is a full-stack web application that turns a simple idea into a complete mystery escape-room experience.

Users provide:

- A mystery theme, such as *haunted mansion*, *space station*, or *ancient temple*
- A difficulty level: **Easy**, **Medium**, or **Hard**

The backend then uses the **Google Gemini API** to generate a structured mystery containing a narrative, multiple rooms, clues, puzzles, and a final solution. Gemini’s API supports structured output, including JSON schemas compatible with Zod in JavaScript. [9]

If the AI service is unavailable, the app falls back to a built-in mystery so the experience remains usable.

---

## 🚀 Features

- 🎭 **Dynamic mystery generation** using Google Gemini
- 🎚️ **Difficulty selection** — Easy, Medium, and Hard
- 🏚️ **Custom escape-room narratives** based on any user-provided theme
- 🧩 **Structured output** — rooms, clues, puzzles, and final solution
- ✅ **JSON validation** using Zod
- 🛟 **Graceful fallback** when Gemini is unavailable
- ⚡ **Modern frontend** built with React and Vite
- 🧠 **Clean backend architecture** using Node.js, Express, and service modules
- 🔐 **Environment-based configuration** for API keys and server settings

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express |
| AI | Google Gemini API |
| Validation | Zod |
| Configuration | dotenv |
| Package Manager | npm |

---

## 📁 Project Structure

```text
AI-Mystery-Room/
├── client/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── data/
│   ├── models/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── test-gemini.js
├── .gitignore
├── README.md
└── SPEC.md
```

---

## 📋 Prerequisites

Make sure you have the following installed:

- **Node.js 18 or later**
- **npm**
- A valid **Google Gemini API key**

You can get a Gemini API key from Google AI Studio.

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone [https://github.com/](https://github.com/)<your-username>/AI-Mystery-Room.git
cd AI-Mystery-Room
```

### 2. Configure the server

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.5-flash
PORT=5000
```

> ⚠️ Never commit your `.env` file or API key to GitHub.

### 3. Start the backend

```bash
npm start
```

The backend will run at:

```text
http://localhost:5000
```

### 4. Configure and start the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev -- --host 0.0.0.0
```

The frontend will run at:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.5-flash
PORT=5000
```

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `GEMINI_MODEL` | Gemini model used for generation |
| `PORT` | Port used by the Express server |

Gemini model names follow the API’s model resource format, and the exact available model identifiers can be checked through the Gemini API models documentation. [1]

---

## 🎮 Usage

1. Open the frontend at `http://localhost:5173`
2. Enter a mystery theme
3. Choose a difficulty level
4. Click **Generate Mystery**
5. Explore the generated rooms, clues, puzzles, and final solution

### Example

| Input | Example result |
|---|---|
| Theme: `Abandoned space station` | A sci-fi mystery involving a missing crew, locked compartments, hidden logs, and a final revelation |
| Difficulty: `Hard` | More complex puzzles, more rooms, and deeper clue connections |

---

## 🧠 How It Works

```text
User Input
    ↓
React Frontend
    ↓
Express API
    ↓
Gemini Service
    ↓
Structured Mystery JSON
    ↓
Zod Validation
    ↓
Interactive Mystery UI
```

1. The user submits a theme and difficulty.
2. The React client sends a request to the Express backend.
3. The backend calls the Gemini API with a carefully designed prompt.
4. Gemini returns a structured mystery in JSON.
5. Zod validates the response.
6. If generation fails, a built-in fallback mystery is served.
7. The frontend displays the story, rooms, clues, puzzles, and solution.

---

## 🛟 Fallback Mode

AI Mystery Room is designed to remain functional even when the Gemini API is unavailable.

If the API request fails, returns invalid JSON, or exceeds usage limits, the backend serves a prebuilt mystery instead. This prevents the application from breaking and ensures users always receive a complete experience.

---

## 🧪 Testing Gemini

The project includes a test script:

```bash
cd server
node test-gemini.js
```

Use this to verify that your Gemini API key and model configuration are working correctly.

---

## 📌 Important Notes

- Keep your `.env` file local and private.
- Do not expose your Gemini API key in frontend code.
- Add `.env` to `.gitignore` before pushing to GitHub.
- The project is intended for educational and personal use.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push to your branch

```bash
git push origin feature/your-feature
```

5. Open a pull request

---

## 📄 License

This project is provided **as-is** for educational and personal use.

---

<div align="center">

**Made with ❤️, React, Node.js, and Google Gemini**

</div>
