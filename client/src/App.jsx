import { useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const starterTheme = 'A forgotten observatory hums beneath a moonlit city while a missing star map has vanished.';

function App() {
  const [theme, setTheme] = useState(starterTheme);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mystery, setMystery] = useState(null);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState({});
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [visibleHints, setVisibleHints] = useState({});
  const [solvedRooms, setSolvedRooms] = useState([]);

  const activeRoom = useMemo(
    () => mystery?.rooms?.[selectedRoomIndex] ?? null,
    [mystery, selectedRoomIndex]
  );

  const allSolved = mystery && solvedRooms.length === mystery.rooms.length;

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!theme.trim() || theme.trim().length < 10) {
      setError('Please write a premise with at least 10 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/mystery/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, difficulty }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Mystery generation failed.');
      }

      setMystery(result.data);
      setSelectedRoomIndex(0);
      setRevealedClues({});
      setAnswers({});
      setFeedback({});
      setVisibleHints({});
      setSolvedRooms([]);
    } catch (generateError) {
      setError(generateError.message || 'Unable to generate the mystery.');
    } finally {
      setLoading(false);
    }
  };

  const revealClue = (roomId, itemId) => {
    const key = `${roomId}-${itemId}`;
    setRevealedClues((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleAnswer = (roomId, room) => {
    const currentAnswer = (answers[roomId] || '').trim().toLowerCase();
    const expectedAnswer = room.puzzle.answer.trim().toLowerCase();

    if (!currentAnswer) {
      setFeedback((current) => ({
        ...current,
        [roomId]: { type: 'error', message: 'Type an answer before submitting.' },
      }));
      return;
    }

    if (currentAnswer === expectedAnswer) {
      setSolvedRooms((current) => (current.includes(roomId) ? current : [...current, roomId]));
      setFeedback((current) => ({
        ...current,
        [roomId]: {
          type: 'success',
          message: room.puzzle.explanation,
        },
      }));
      return;
    }

    setFeedback((current) => ({
      ...current,
      [roomId]: {
        type: 'error',
        message: 'That answer does not fit the evidence. Search the room again.',
      },
    }));
  };

  const showHint = (roomId, room) => {
    const visible = visibleHints[roomId] || [];
    const hintIndex = visible.length;
    const hintText = room.puzzle.hints[hintIndex];

    if (!hintText) {
      setFeedback((current) => ({
        ...current,
        [roomId]: {
          type: 'info',
          message: 'No more hints remain for this room.',
        },
      }));
      return;
    }

    setVisibleHints((current) => ({
      ...current,
      [roomId]: [...visible, hintText],
    }));
  };

  const startNewGame = () => {
    setMystery(null);
    setSelectedRoomIndex(0);
    setRevealedClues({});
    setAnswers({});
    setFeedback({});
    setVisibleHints({});
    setSolvedRooms([]);
    setError('');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI escape room</p>
          <h1>AI Mystery Room</h1>
        </div>
        {mystery && (
          <button className="ghost-button" onClick={startNewGame}>
            New mystery
          </button>
        )}
      </header>

      {!mystery ? (
        <main className="landing-panel">
          <section className="intro-copy">
            <p className="eyebrow">Dynamic mystery generation</p>
            <h2>Build a one-of-a-kind case using Gemini.</h2>
            <p>
              Describe your theme, choose a difficulty, and the backend will generate a custom mystery
              complete with rooms, items, clues, puzzles, and a final solution.
            </p>
          </section>

          <form className="generator-card" onSubmit={handleGenerate}>
            <label htmlFor="theme">Mystery premise</label>
            <textarea
              id="theme"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              placeholder="A secret observatory has gone dark..."
              rows={5}
            />

            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Generating…' : 'Generate mystery'}
            </button>

            {error && <p className="error-banner">{error}</p>}
          </form>
        </main>
      ) : (
        <main className="game-layout">
          <section className="story-panel">
            <div className="mystery-header">
              <div>
                <p className="eyebrow">{mystery.theme}</p>
                <h2>{mystery.title}</h2>
              </div>
              <div className="pill-row">
                <span className="pill">{mystery.difficulty}</span>
                <span className="pill">{mystery.estimatedCompletionTime}</span>
              </div>
            </div>

            <p className="story-text">{mystery.story}</p>

            <div className="room-list">
              {mystery.rooms.map((room, index) => (
                <button
                  key={room.id}
                  type="button"
                  className={`room-tab ${selectedRoomIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedRoomIndex(index)}
                >
                  <span>{room.name}</span>
                  {solvedRooms.includes(room.id) ? <strong>✓ Solved</strong> : <strong>Open</strong>}
                </button>
              ))}
            </div>

            {activeRoom && (
              <div className="room-card">
                <h3>{activeRoom.name}</h3>
                <p>{activeRoom.description}</p>

                <div className="items-grid">
                  {activeRoom.items.map((item) => {
                    const clueVisible = revealedClues[`${activeRoom.id}-${item.id}`];
                    return (
                      <div key={item.id} className="item-card">
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <button type="button" className="secondary-button" onClick={() => revealClue(activeRoom.id, item.id)}>
                          {clueVisible ? 'Hide clue' : 'Inspect item'}
                        </button>
                        {clueVisible && <p className="clue-box">{item.clue}</p>}
                      </div>
                    );
                  })}
                </div>

                <div className="puzzle-box">
                  <h4>Puzzle</h4>
                  <p>{activeRoom.puzzle.question}</p>
                  <div className="answer-row">
                    <input
                      type="text"
                      value={answers[activeRoom.id] || ''}
                      onChange={(event) =>
                        setAnswers((current) => ({
                          ...current,
                          [activeRoom.id]: event.target.value,
                        }))
                      }
                      placeholder="Type your answer"
                    />
                    <button type="button" className="primary-button" onClick={() => handleAnswer(activeRoom.id, activeRoom)}>
                      Submit
                    </button>
                  </div>

                  <div className="hint-panel">
                    <button type="button" className="secondary-button" onClick={() => showHint(activeRoom.id, activeRoom)}>
                      {visibleHints[activeRoom.id]?.length >= activeRoom.puzzle.hints.length
                        ? 'Hints exhausted'
                        : 'Reveal next hint'}
                    </button>
                    {visibleHints[activeRoom.id]?.map((hint, index) => (
                      <p key={`${activeRoom.id}-${index}`} className="hint-box">
                        {hint}
                      </p>
                    ))}
                  </div>

                  {feedback[activeRoom.id] && (
                    <p className={`feedback ${feedback[activeRoom.id].type}`}>
                      {feedback[activeRoom.id].message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          {allSolved && (
            <aside className="victory-panel">
              <p className="eyebrow">Case solved</p>
              <h3>{mystery.finalSolution.summary}</h3>
              <p>{mystery.finalSolution.successMessage}</p>
            </aside>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
