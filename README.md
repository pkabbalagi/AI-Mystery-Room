# AI Mystery Room

AI Mystery Room is a full-stack web app that generates a custom mystery escape-room story using Google Gemini. Users enter a theme and difficulty, and the backend creates a fully structured mystery with rooms, clues, puzzles, and a final solution.

## Features

- Dynamic mystery generation with Gemini AI
- Difficulty selection: easy, medium, hard
- Custom escape-room style narrative
- Frontend built with React + Vite
- Backend built with Node.js + Express
- JSON validation for generated mysteries
- Fallback mystery generation if AI is unavailable

## Project Structure

```text
AI-Mystery-Room/
├── client/                 # React frontend
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── data/
│   ├── models/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── test-gemini.js
├── SPEC.md                # Product specification
├── .gitignore
└── README.md
```

## Tech Stack

- Frontend: React, Vite, JavaScript
- Backend: Node.js, Express
- AI: Google Gemini API
- Validation: Zod

## Prerequisites

- Node.js 18+
- npm
- A Google Gemini API key

## Setup

1. Clone the repository
2. Open the server folder and create a .env file based on .env.example
3. Add your Gemini API key
4. Install dependencies for both client and server

### Server

```bash
cd server
npm install
cp .env.example .env
# add your Gemini API key in .env
npm start
```

### Client

```bash
cd client
npm install
npm run dev -- --host 0.0.0.0
```

## Environment Variables

Server `.env` example:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.5-flash
PORT=5000
```

## Running the App

- Frontend runs at: http://localhost:5173
- Backend runs at: http://localhost:5000

## Usage

1. Open the frontend in the browser
2. Enter a theme for the mystery
3. Select a difficulty level
4. Click “Generate mystery”
5. Explore the generated story, rooms, clues, and final solution

## Notes

- The app uses Gemini for creative generation, but it can gracefully fall back to a built-in mystery if the API is unavailable.
- Keep your `.env` file local and do not commit API keys to GitHub.

## License

This project is currently provided as-is for educational and personal use.
