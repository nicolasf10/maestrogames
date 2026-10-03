import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, RotateCcw, Play, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

const BOARD_WIDTH = 280;
const BOARD_HEIGHT = 320;
const PADDLE_WIDTH = 64;

export const BrickBreakerGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('INTRO'); // 'INTRO' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'
  const [paddleX, setPaddleX] = useState(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ball, setBall] = useState({ x: 140, y: 220, dx: 4, dy: -4 });
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);

  const paddleXRef = useRef(paddleX);
  paddleXRef.current = paddleX;

  const initBricks = () => {
    const list = [];
    const rows = 4;
    const cols = 5;
    const w = 48;
    const h = 18;
    const pad = 6;
    const offsetX = 8;
    const offsetY = 30;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({
          id: `${r}-${c}`,
          x: offsetX + c * (w + pad),
          y: offsetY + r * (h + pad),
          width: w,
          height: h,
          active: true
        });
      }
    }
    return list;
  };

  const startGame = () => {
    setPaddleX(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2);
    setBall({ x: 140, y: 220, dx: 3, dy: -4 });
    setBricks(initBricks());
    setScore(0);
    setGameState('PLAYING');
  };

  // Keyboard Paddle Movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'PLAYING') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPaddleX(x => Math.max(0, x - 20));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPaddleX(x => Math.min(BOARD_WIDTH - PADDLE_WIDTH, x + 20));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Bouncing Ball Physics Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      setBall(prevBall => {
        let { x, y, dx, dy } = prevBall;
        let newX = x + dx;
        let newY = y + dy;

        // Wall Bounce X
        if (newX <= 5 || newX >= BOARD_WIDTH - 15) {
          dx = -dx;
          newX = x + dx;
        }

        // Wall Bounce Top
        if (newY <= 5) {
          dy = -dy;
          newY = y + dy;
        }

        // Check Bottom Fall (Game Over)
        if (newY >= BOARD_HEIGHT - 10) {
          setGameState('GAMEOVER');
          return prevBall;
        }

        // Paddle Bounce
        const currentPaddleX = paddleXRef.current;
        if (
          newY >= BOARD_HEIGHT - 35 &&
          newY <= BOARD_HEIGHT - 20 &&
          newX >= currentPaddleX - 10 &&
          newX <= currentPaddleX + PADDLE_WIDTH + 10
        ) {
          dy = -Math.abs(dy); // Always reflect upward
          newY = BOARD_HEIGHT - 36;
        }

        // Brick Bounce Collisions
        setBricks(prevBricks => {
          let updatedBricks = [...prevBricks];
          let hitAny = false;

          updatedBricks.forEach(brick => {
            if (!brick.active || hitAny) return;

            if (
              newX >= brick.x - 6 &&
              newX <= brick.x + brick.width + 6 &&
              newY >= brick.y - 6 &&
              newY <= brick.y + brick.height + 6
            ) {
              brick.active = false;
              dy = -dy;
              hitAny = true;
              setScore(s => s + 20);
            }
          });

          // Check Victory (All Bricks Cleared)
          const remaining = updatedBricks.filter(b => b.active);
          if (remaining.length === 0) {
            setGameState('VICTORY');
            confetti({ particleCount: 50, spread: 70 });
          }

          return updatedBricks;
        });

        return { x: newX, y: newY, dx, dy };
      });
    }, 30);

    return () => clearInterval(interval);
  }, [gameState]);

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
            🧱
          </div>

          <h2 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '1.6rem',
            color: '#fff',
            textShadow: '0 0 12px var(--neon-cyan)'
          }}>
            שובש לבנים
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
              הזיזו את מחבט הניאון כדי להקפיץ את כדור האנרגיה ולשבור את כל הלבנים על המסך!
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

  // GAMEOVER or VICTORY VIEW
  if (gameState === 'GAMEOVER' || gameState === 'VICTORY') {
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
        <div style={{ fontSize: '3rem' }}>
          {gameState === 'VICTORY' ? '🏆' : '💥'}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '1.8rem',
          color: gameState === 'VICTORY' ? '#4ade80' : '#f43f5e',
          textShadow: `0 0 15px ${gameState === 'VICTORY' ? '#4ade80' : '#f43f5e'}`
        }}>
          {gameState === 'VICTORY' ? '!ניצחון מוחץ' : '!הכדור נפל'}
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

  // PLAYING BRICK BREAKER VIEW
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

      {/* Main Board */}
      <div style={{
        width: `${BOARD_WIDTH}px`,
        height: `${BOARD_HEIGHT}px`,
        background: '#040816',
        border: '2px solid var(--neon-cyan)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
      }}>
        {/* Bricks */}
        {bricks.map(b => b.active && (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: `${b.x}px`,
              top: `${b.y}px`,
              width: `${b.width}px`,
              height: `${b.height}px`,
              background: 'linear-gradient(135deg, #00f0ff 0%, #2563eb 100%)',
              borderRadius: '4px',
              border: '1px solid #ffffff',
              boxShadow: '0 0 6px rgba(0, 240, 255, 0.6)'
            }}
          />
        ))}

        {/* Bouncing Ball */}
        <div
          style={{
            position: 'absolute',
            left: `${ball.x}px`,
            top: `${ball.y}px`,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 0 10px #00f0ff'
          }}
        />

        {/* Paddle */}
        <div
          style={{
            position: 'absolute',
            left: `${paddleX}px`,
            bottom: '15px',
            width: `${PADDLE_WIDTH}px`,
            height: '14px',
            background: '#00f0ff',
            borderRadius: '8px',
            boxShadow: '0 0 12px #00f0ff'
          }}
        />
      </div>

      {/* Touch Left / Right Controls */}
      <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '280px' }}>
        <button
          onClick={() => setPaddleX(x => Math.max(0, x - 26))}
          style={{
            flex: 1,
            padding: '12px 0',
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
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={() => setPaddleX(x => Math.min(BOARD_WIDTH - PADDLE_WIDTH, x + 26))}
          style={{
            flex: 1,
            padding: '12px 0',
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
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};
