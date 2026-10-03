import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, RotateCcw, Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight as ArrowR } from 'lucide-react';
import confetti from 'canvas-confetti';

const GRID_SIZE = 16;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 8, y: 9 },
  { x: 8, y: 10 }
];

export const SnakeGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('INTRO'); // 'INTRO' | 'PLAYING' | 'GAMEOVER'
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Moving UP
  const [food, setFood] = useState({ x: 4, y: 4 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const collision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!collision) break;
    }
    return newFood;
  };

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setGameState('PLAYING');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'PLAYING') return;
      const curr = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (curr.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (curr.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (curr.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (curr.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Game Loop Interval
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const dir = directionRef.current;
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Check Wall Collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameState('GAMEOVER');
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameState('GAMEOVER');
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const nextScore = s + 10;
            if (nextScore > highScore) setHighScore(nextScore);
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [gameState, food, highScore]);

  // Handle D-Pad Click
  const handleDirClick = (dirX, dirY) => {
    const curr = directionRef.current;
    if (dirX !== 0 && curr.x === 0) setDirection({ x: dirX, y: 0 });
    if (dirY !== 0 && curr.y === 0) setDirection({ x: 0, y: dirY });
  };

  // INTRO VIEW
  if (gameState === 'INTRO') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '16px 12px',
        textAlign: 'center',
        direction: 'rtl'
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: 'var(--neon-cyan)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowRight size={16} />
            <span>תפריט ראשי</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px #00f0ff)' }}>
            🐍
          </div>

          <h2 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '1.6rem',
            color: '#fff',
            textShadow: '0 0 12px var(--neon-cyan)'
          }}>
            סייבר סנייק
          </h2>

          <div style={{
            background: 'rgba(13, 22, 48, 0.85)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '0.85rem',
            color: '#e2e8f0',
            lineHeight: '1.6',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}>
            <p style={{ fontWeight: 'bold', color: 'var(--neon-cyan)' }}>
              איך משחקים?
            </p>
            <p>
              השתמשו בכפתורי החצים במסך או במקלדת כדי להנחות את נחש הניאון! אספו כמה שיותר אוכל זוהר מבלי להתנגש בקירות או בעצמכם.
            </p>
          </div>
        </div>

        <button
          onClick={startGame}
          style={{
            width: '100%',
            padding: '14px 0',
            background: 'linear-gradient(90deg, #00f0ff 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '14px',
            color: '#050814',
            fontFamily: 'var(--font-arcade)',
            fontSize: '1.1rem',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Play size={20} fill="#050814" />
          <span>התחל משחק!</span>
        </button>
      </div>
    );
  }

  // GAME OVER VIEW
  if (gameState === 'GAMEOVER') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '20px 16px',
        textAlign: 'center',
        gap: '20px',
        direction: 'rtl'
      }}>
        <div style={{ fontSize: '3rem' }}>💥</div>

        <h2 style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '1.8rem',
          color: '#f43f5e',
          textShadow: '0 0 15px #f43f5e'
        }}>
          המשחק הסתיים!
        </h2>

        <div style={{
          background: 'rgba(13, 22, 48, 0.9)',
          border: '2px solid var(--neon-cyan)',
          borderRadius: '20px',
          padding: '20px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>ניקוד סופי:</div>
          <div style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--neon-cyan)', fontFamily: 'var(--font-arcade)' }}>
            {score}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>שיא: {highScore}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
          <button
            onClick={startGame}
            style={{
              width: '100%',
              padding: '12px 0',
              background: 'linear-gradient(90deg, #00f0ff 0%, #3b82f6 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#050814',
              fontFamily: 'var(--font-arcade)',
              fontSize: '0.95rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <RotateCcw size={16} />
            <span>משחק חדש</span>
          </button>

          <button
            onClick={onBack}
            style={{
              width: '100%',
              padding: '10px 0',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            תפריט ראשי
          </button>
        </div>
      </div>
    );
  }

  // PLAYING SNAKE VIEW
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      padding: '10px',
      direction: 'rtl'
    }}>
      {/* Top Bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          יציאה
        </button>

        <div style={{ fontFamily: 'var(--font-arcade)', color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>
          ניקוד: {score}
        </div>
      </div>

      {/* Snake Game Board Grid */}
      <div style={{
        width: '280px',
        height: '280px',
        background: '#040816',
        border: '2px solid var(--neon-cyan)',
        borderRadius: '16px',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        gap: '1px',
        padding: '4px'
      }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);

          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = snake.slice(1).some(seg => seg.x === x && seg.y === y);
          const isFoodItem = food.x === x && food.y === y;

          let bg = 'transparent';
          if (isHead) bg = '#00f0ff';
          else if (isBody) bg = '#2563eb';
          else if (isFoodItem) bg = '#f43f5e';

          return (
            <div
              key={index}
              style={{
                background: bg,
                borderRadius: isFoodItem ? '50%' : '3px',
                boxShadow: isHead || isFoodItem ? `0 0 6px ${bg}` : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Mobile D-Pad Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 44px)',
        gridTemplateRows: 'repeat(3, 44px)',
        gap: '6px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div />
        <button
          onClick={() => handleDirClick(0, -1)}
          style={{
            background: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid var(--neon-cyan)',
            color: 'var(--neon-cyan)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowUp size={20} />
        </button>
        <div />

        <button
          onClick={() => handleDirClick(-1, 0)}
          style={{
            background: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid var(--neon-cyan)',
            color: 'var(--neon-cyan)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-cyan)' }} />
        </div>

        <button
          onClick={() => handleDirClick(1, 0)}
          style={{
            background: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid var(--neon-cyan)',
            color: 'var(--neon-cyan)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowR size={20} />
        </button>

        <div />
        <button
          onClick={() => handleDirClick(0, 1)}
          style={{
            background: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid var(--neon-cyan)',
            color: 'var(--neon-cyan)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowDown size={20} />
        </button>
        <div />
      </div>
    </div>
  );
};
