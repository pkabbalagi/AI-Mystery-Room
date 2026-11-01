import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const difficultyConfig = {
  easy: { rooms: 3 },
  medium: { rooms: 3 },
  hard: { rooms: 3 },
};

const text = z.string().trim().min(1);

const puzzleSchema = z.object({
  question: text,
  answer: text,
  hints: z.array(z.string().trim().min(1)).length(3),
  explanation: text,
});

const itemSchema = z.object({
  id: text,
  name: text,
  description: text,
  clue: text,
});

const roomSchema = z.object({
  id: text,
  name: text,
  description: text,
  items: z.array(itemSchema).min(2).max(4),
  puzzle: puzzleSchema,
});

const mysterySchema = z.object({
  title: text,
  theme: text,
  difficulty: z.enum(["easy", "medium", "hard"]),
  estimatedCompletionTime: text,
  story: z.string().trim().min(20),
  rooms: z.array(roomSchema).length(3),
  finalSolution: z.object({
    summary: text,
    successMessage: text,
  }),
});

export function validateMystery(data, difficulty) {
  const cleaned = mysterySchema.parse(data);

  if (cleaned.difficulty !== difficulty) {
    throw new Error("Difficulty does not match the requested value.");
  }

  if (cleaned.rooms.length !== difficultyConfig[difficulty].rooms) {
    throw new Error("The mystery must contain exactly three rooms.");
  }

  for (const room of cleaned.rooms) {
    const uniqueItemIds = new Set(room.items.map((item) => item.id));
    if (uniqueItemIds.size !== room.items.length) {
      throw new Error(`Duplicate item IDs found in room ${room.name}.`);
    }

    if (room.puzzle.hints.length !== 3) {
      throw new Error(`Room ${room.name} must have exactly three hints.`);
    }
  }

  return cleaned;
}

function parseGeminiText(response) {
  const directText = typeof response?.text === "string" ? response.text : "";
  if (directText) {
    return directText;
  }

  return response?.candidates
    ?.map((candidate) =>
      candidate?.content?.parts
        ?.map((part) => part?.text ?? "")
        .join("") ?? ""
    )
    .join("") ?? "";
}

function normalizeJsonString(raw) {
  if (!raw) {
    return raw;
  }

  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function isTransientGeminiError(error) {
  const message = String(error?.message || "");
  const statusCode = Number(error?.status || error?.code);

  return (
    /429|rate limit|quota|503|temporar|overloaded|unavailable|500/i.test(message) ||
    [429, 500, 503].includes(statusCode)
  );
}

function toTitleCase(value) {
  return String(value || "Mystery")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildFallbackMystery(theme, difficulty) {
  const normalizedDifficulty = String(difficulty || "medium").toLowerCase();
  const cleanedTheme = String(theme || "Moonlit Mystery").trim() || "Moonlit Mystery";
  const timeMap = {
    easy: "20-25 minutes",
    medium: "30-40 minutes",
    hard: "45-60 minutes",
  };

  const fallbackMystery = {
    title: `${toTitleCase(cleanedTheme)} Case`,
    theme: cleanedTheme,
    difficulty: normalizedDifficulty,
    estimatedCompletionTime: timeMap[normalizedDifficulty] || timeMap.medium,
    story:
      `The ${cleanedTheme.toLowerCase()} has fallen silent, and a valuable relic has vanished before the final bell. The clues are scattered across three rooms, each revealing a shard of the truth, but the final answer still waits just beyond the last locked door.`,
    rooms: [
      {
        id: "room-1",
        name: "Lantern Hall",
        description: "A dim gallery lined with cracked mirrors and a single glowing lantern.",
        items: [
          {
            id: "item-1",
            name: "Copper Lantern",
            description: "A brass lantern whose flame burns in a steady blue glow.",
            clue: "A scratched arrow points east and matches the direction of the lantern's brightest reflection.",
          },
          {
            id: "item-2",
            name: "Map Fragment",
            description: "A torn parchment showing a compass and a faded tunnel mark.",
            clue: "The hidden passage is marked with an arrow that points toward the sunrise.",
          },
        ],
        puzzle: {
          question: "Which direction does the hidden tunnel point?",
          answer: "east",
          hints: [
            "Look for the bright reflection the lantern makes.",
            "The route matches the direction of the sunrise.",
            "The answer is the compass direction that rises with the morning light.",
          ],
          explanation: "The lantern glow and scratched map both align with east, revealing the passage hidden behind the mirror wall.",
        },
      },
      {
        id: "room-2",
        name: "Archive Vault",
        description: "Shelves of dusty records and a sealed lockbox sit under a low golden light.",
        items: [
          {
            id: "item-3",
            name: "Star Ledger",
            description: "A journal listing the names of seven celestial markers.",
            clue: "The third entry is circled repeatedly, as if it was intentionally emphasized.",
          },
          {
            id: "item-4",
            name: "Lockbox",
            description: "A metal box with a numbered dial and fresh fingerprints on the handle.",
            clue: "The dial must be set to the number hidden in the ledger's highlighted entry.",
          },
        ],
        puzzle: {
          question: "What number unlocks the box?",
          answer: "3",
          hints: [
            "The clue mentions a numbered position rather than a symbol.",
            "Think about the highlighted entry in the ledger.",
            "The answer is the third mark in the sequence.",
          ],
          explanation: "The ledger highlights the third entry, which is the key number needed to unlock the lockbox.",
        },
      },
      {
        id: "room-3",
        name: "Moonstone Chamber",
        description: "A circular room of pale stone and a sealed pedestal at the center.",
        items: [
          {
            id: "item-5",
            name: "Footprints",
            description: "Dusty marks leading toward the pedestal and stopping in a half-circle.",
            clue: "The trail ends exactly where the final clue is carved into the stone.",
          },
          {
            id: "item-6",
            name: "Pedestal",
            description: "A polished stone plinth marked with a final phrase in old script.",
            clue: "The phrase hints at a season of the sky and the longest day of the year.",
          },
        ],
        puzzle: {
          question: "What is the final code word?",
          answer: "solstice",
          hints: [
            "The clue is linked to the sky and the changing of seasons.",
            "Think of the longest day of the year.",
            "The answer is a special seasonal event in the sky.",
          ],
          explanation: "The final phrase references the solstice, which completes the mystery and opens the hidden compartment.",
        },
      },
    ],
    finalSolution: {
      summary: "The culprit was the caretaker, who used the hidden path, the numbered ledger, and the sky clue to steal the relic and hide it in the moonstone chamber. The three room clues were enough to reveal the true route and the final code.",
      successMessage: "You restored the missing relic and solved the mystery before the clock struck midnight!",
    },
  };

  return validateMystery(fallbackMystery, normalizedDifficulty);
}

async function requestGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelCandidates = [...new Set([
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-pro-preview",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
  ].filter(Boolean))];

  let lastError = null;

  for (const model of modelCandidates) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            temperature: 0.9,
          },
        });

        const raw = normalizeJsonString(parseGeminiText(response));
        if (!raw) {
          throw new Error("Gemini returned an empty response.");
        }

        return JSON.parse(raw);
      } catch (error) {
        lastError = error;
        const message = String(error?.message || "");
        const retryable = isTransientGeminiError(error);

        if (/api key|key is invalid|authentication/i.test(message)) {
          throw new Error("The Gemini API key is invalid or missing.");
        }

        if (!retryable || attempt === 1) {
          break;
        }

        const delay = 1000 * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  if (lastError && isTransientGeminiError(lastError)) {
    throw new Error("Gemini is temporarily unavailable. Please try again in a moment.");
  }

  throw lastError || new Error("Unable to generate the mystery.");
}

export async function generateMystery(theme, difficulty) {
  const normalizedDifficulty = difficulty?.toLowerCase();
  if (!difficultyConfig[normalizedDifficulty]) {
    throw new Error("Difficulty must be easy, medium, or hard.");
  }

  const cleanedTheme = theme?.trim();
  if (!cleanedTheme || cleanedTheme.length < 10 || cleanedTheme.length > 200) {
    throw new Error("Theme must be between 10 and 200 characters.");
  }

  const prompt = `
You are creating a unique, age-appropriate mystery escape room game.

Goal:
Generate a single original mystery in valid JSON only. No markdown fences.

Theme: ${JSON.stringify(cleanedTheme)}
Difficulty: ${normalizedDifficulty}

Return this exact JSON structure:
{
  "title": "Short mystery title",
  "theme": "The overall atmosphere or motif",
  "difficulty": "easy|medium|hard",
  "estimatedCompletionTime": "25-35 minutes",
  "story": "A rich introduction to the setting and the mystery. Do not reveal the final answer.",
  "rooms": [
    {
      "id": "room-1",
      "name": "Room name",
      "description": "Descriptive room summary",
      "items": [
        {
          "id": "item-1",
          "name": "Object name",
          "description": "How it looks or feels",
          "clue": "A clue that helps the player learn something important"
        }
      ],
      "puzzle": {
        "question": "A room puzzle question",
        "answer": "The correct answer text",
        "hints": ["Hint 1", "Hint 2", "Hint 3"],
        "explanation": "Why this answer is correct and how it fits the mystery"
      }
    }
  ],
  "finalSolution": {
    "summary": "How the mystery was solved in a few sentences",
    "successMessage": "A cheerful success message for the player"
  }
}

Requirements:
- Return valid JSON only.
- Use exactly 3 rooms.
- Each room should contain 2 to 4 interactive items.
- Each room needs exactly 1 puzzle with exactly 3 progressive hints.
- Every room must contain clues and puzzle logic that combine into the final solution.
- The final answer must be solvable using the room clues, not by random guessing.
- Keep the content family-friendly, imaginative, logical, and original.
- Make the answer text for each puzzle short, clear, and exact.
- The story should introduce the mystery without revealing the culprit or final solution.
- Provide a clear finalSolution summary that explains the entire case.
- The mystery must be solvable in a single playthrough.
- Use unique IDs within each room and across the full JSON object.
- The difficulty should be one of: easy, medium, hard.
`;

  try {
    const raw = await requestGemini(prompt);
    return validateMystery(raw, normalizedDifficulty);
  } catch (error) {
    const message = String(error?.message || "");
    if (/api key|missing from the environment|invalid or missing/i.test(message)) {
      return buildFallbackMystery(cleanedTheme, normalizedDifficulty);
    }

    if (/temporar|unavailable|overloaded|503|429|rate limit|quota/i.test(message)) {
      return buildFallbackMystery(cleanedTheme, normalizedDifficulty);
    }

    throw error;
  }
}