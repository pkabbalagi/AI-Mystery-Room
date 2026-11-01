import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateMystery } from './services/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
const dataFilePath = path.join(__dirname, 'data', 'mysteries.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

async function ensureMysteryStore() {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, '[]', 'utf8');
  }
}

async function saveMystery(mystery) {
  await ensureMysteryStore();

  const storedMysteries = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  const nextMysteries = [...storedMysteries, mystery];

  await fs.writeFile(dataFilePath, JSON.stringify(nextMysteries, null, 2), 'utf8');
  return mystery;
}

app.get('/', (req, res) => {
  res.json({
    message: 'AI Mystery Room backend is running',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is healthy' });
});

app.get('/api/mystery/latest', async (req, res) => {
  try {
    await ensureMysteryStore();
    const stored = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
    const latest = stored.at(-1) ?? null;

    res.json({
      success: true,
      data: latest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to load the latest mystery.',
    });
  }
});

app.post('/api/mystery/generate', async (req, res) => {
  const { theme, difficulty = 'medium' } = req.body || {};
  const cleanedTheme = typeof theme === 'string' ? theme.trim() : '';
  const cleanedDifficulty = typeof difficulty === 'string' ? difficulty.trim().toLowerCase() : 'medium';

  if (!cleanedTheme || cleanedTheme.length < 10 || cleanedTheme.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'Theme must be between 10 and 200 characters.',
    });
  }

  if (!['easy', 'medium', 'hard'].includes(cleanedDifficulty)) {
    return res.status(400).json({
      success: false,
      error: 'Difficulty must be easy, medium, or hard.',
    });
  }

  try {
    const mystery = await generateMystery(cleanedTheme, cleanedDifficulty);
    const savedMystery = await saveMystery(mystery);

    res.status(201).json({
      success: true,
      data: savedMystery,
    });
  } catch (error) {
    const message = error?.message || 'Unable to generate a mystery right now.';

    if (/API key|missing from the environment|invalid or missing/i.test(message)) {
      return res.status(401).json({
        success: false,
        error: 'The Gemini API key is missing or invalid.',
      });
    }

    if (/rate limit|quota|429/i.test(message)) {
      return res.status(429).json({
        success: false,
        error: 'Gemini rate limit reached. Please wait a moment and try again.',
      });
    }

    if (/temporar|overloaded|unavailable|503/i.test(message)) {
      return res.status(503).json({
        success: false,
        error: 'Gemini is temporarily unavailable. Please try again soon.',
      });
    }

    res.status(400).json({
      success: false,
      error: message,
    });
  }
});

app.use((error, req, res, next) => {
  console.error('Unhandled server error:', error);
  res.status(500).json({
    success: false,
    error: 'Unexpected server error.',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});