import { generateMystery } from "./services/gemini.js";

async function test() {
  try {
    console.log("Generating a test mystery...");

    const mystery = await generateMystery(
      "A valuable painting disappears during a school art exhibition.",
      "easy"
    );

    console.log("Gemini test successful!");
    console.log("Title:", mystery.title);
    console.log("Suspects:", mystery.suspects.length);
    console.log("Clues:", mystery.clues.length);
    console.log("Hints:", mystery.hints.length);
  } catch (error) {
    console.error("Gemini test failed:", error.message);
    process.exitCode = 1;
  }
}

test();