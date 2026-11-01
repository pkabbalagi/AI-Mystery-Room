import test from 'node:test';
import assert from 'node:assert/strict';

import { buildFallbackMystery, validateMystery } from './gemini.js';

const validMystery = {
  title: 'The Lantern Below',
  theme: 'Moonlit observatory mystery',
  difficulty: 'medium',
  estimatedCompletionTime: '30 minutes',
  story:
    'A strange power outage grips the observatory as the rare moon map disappears from the vault. The staff are shaken, yet nothing feels random. Someone knows the building well enough to move unseen.',
  rooms: [
    {
      id: 'room-1',
      name: 'Clock Tower',
      description: 'A chamber of ticking gears and dim lanterns.',
      items: [
        { id: 'item-1', name: 'Lantern', description: 'A brass lantern with soot stains.', clue: 'The flame burns blue near the east rail.' },
        { id: 'item-2', name: 'Desk', description: 'A map table with a cracked ruler.', clue: 'The ruler shows a missing mark near the east wall.' },
      ],
      puzzle: {
        question: 'Which direction does the hidden tunnel point?',
        answer: 'east',
        hints: ['Check the brightest clue in the room.', 'Look for the direction hidden in the map.', 'The answer is the compass direction the blue flame points toward.'],
        explanation: 'The blue flame and map both point east, revealing the tunnel.',
      },
    },
    {
      id: 'room-2',
      name: 'Archive Hall',
      description: 'Shelves of old star charts line the walls.',
      items: [
        { id: 'item-3', name: 'Star Chart', description: 'A chart with torn edges.', clue: 'A faded ring circles the third constellation.' },
        { id: 'item-4', name: 'Lockbox', description: 'A metal box with a tiny dial.', clue: 'The dial is set to a number that matches a famous star.' },
      ],
      puzzle: {
        question: 'What number unlocks the box?',
        answer: '3',
        hints: ['The clue mentions a numbered star pattern.', 'Think about the third constellation.', 'The answer is the number three.'],
        explanation: 'The third constellation is the key number, so the lock opens at 3.',
      },
    },
    {
      id: 'room-3',
      name: 'Lower Vault',
      description: 'A stone vault with a sealed pedestal and faint footprints.',
      items: [
        { id: 'item-5', name: 'Footprints', description: 'Dusty marks leading to the pedestal.', clue: 'They stop at the same stone the map mentioned.' },
        { id: 'item-6', name: 'Pedestal', description: 'A circular stone base with a clasp.', clue: 'The clasp bears a signature from the astronomer.' },
      ],
      puzzle: {
        question: 'What is the final code word?',
        answer: 'solstice',
        hints: ['The astronomer signed the clasp.', 'The word relates to the sky and the longest day.', 'The answer is a seasonal sky event.'],
        explanation: 'The astronomer left the clue to a solstice, which matches the final word.',
      },
    },
  ],
  finalSolution: {
    summary: 'The missing moon map was hidden by the observatory keeper, who used the room clues to guide the team to the vault.',
    successMessage: 'You solved the mystery and restored the observatory to its rightful order!',
  },
};

test('validateMystery accepts a complete mystery object', () => {
  const result = validateMystery(validMystery, 'medium');
  assert.equal(result.title, 'The Lantern Below');
  assert.equal(result.rooms.length, 3);
});

test('validateMystery rejects a mismatched difficulty', () => {
  assert.throws(() => validateMystery(validMystery, 'easy'), /Difficulty does not match/i);
});

test('buildFallbackMystery creates a valid mystery structure', () => {
  const result = validateMystery(buildFallbackMystery('Moonlit observatory', 'hard'), 'hard');
  assert.equal(result.difficulty, 'hard');
  assert.equal(result.rooms.length, 3);
  assert.ok(result.story.length >= 20);
  assert.equal(result.finalSolution.summary.length > 0, true);
});
