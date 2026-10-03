import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, RotateCcw, Play, ChevronLeft, ChevronRight, Zap, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const GAME_WIDTH = 280;
const GAME_HEIGHT = 320;
const SHIP_WIDTH = 36;

export const SpaceBlasterGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('INTRO'); // 'INTRO' | 'PLAYING' | 'GAMEOVER'
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - SHIP_WIDTH / 2);
  const [lasers, setLasers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const playerXRef = useRef(playerX);
  playerXRef.current = playerX;

  const startGame = () => {
    setPlayerX(GAME_WIDTH / 2 - SHIP_WIDTH / 2);
    setLasers([]);
    setEnemies([]);
    setScore(0);
    setLives(3);
    setGameState('PLAYING');
  };

  // Keyboard Left / Right Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'PLAYING') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerX(x => Math.max(0, x - 18));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerX(x => Math.min(GAME_WIDTH - SHIP_WIDTH, x + 18));
      } else if (e.key === ' ' || e.key === 'ArrowUp') {
        fireLaser();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Fire Laser Helper
  const fireLaser = () => {
    if (gameState !== 'PLAYING') return;
    const currentX = playerXRef.current;
    setLasers(prev => [
      ...prev,
      { id: Math.random(), x: currentX + SHIP_WIDTH / 2 - 3, y: GAME_HEIGHT - 40 }
    ]);
  };

  // Main Game Loop Animation Tick
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      // 1. Move Lasers Up
      setLasers(prevLasers => 
        prevLasers
          .map(laser => ({ ...laser, y: laser.y - 12 }))
          .filter(laser => laser.y > 0)
      );

      // 2. Move Enemies Down & Spawn New Enemies
      setEnemies(prevEnemies => {
        let updatedEnemies = prevEnemies.map(enemy => ({ ...enemy, y: enemy.y + 3 }));

        // Check if enemy hit bottom
        const hitBottom = updatedEnemies.filter(enemy => enemy.y >= GAME_HEIGHT - 35);
        if (hitBottom.length > 0) {
          setLives(l => {
            const nextL = l - hitBottom.length;
            if (nextL <= 0) setGameState('GAMEOVER');
            return Math.max(0, nextL);
          });
          updatedEnemies = updatedEnemies.filter(enemy => enemy.y < GAME_HEIGHT - 35);
        }

        // Randomly Spawn Enemy
        if (Math.random() < 0.25 && updatedEnemies.length < 6) {
          updatedEnemies.push({
            id: Math.random(),
            x: Math.floor(Math.random() * (GAME_WIDTH - 30)),
            y: -20
          });
        }

        return updatedEnemies;
      });

      // 3. Check Laser <-> Enemy Collisions
      setLasers(prevLasers => {
        let remainingLasers = [...prevLasers];

        setEnemies(prevEnemies => {
          let remainingEnemies = [...prevEnemies];

          remainingLasers.forEach(laser => {
            const hitEnemyIndex = remainingEnemies.findIndex(
              enemy =>
                laser.x >= enemy.x - 10 &&
                laser.x <= enemy.x + 30 &&
                laser.y >= enemy.y &&
                laser.y <= enemy.y + 25
            );

            if (hitEnemyIndex !== -1) {
              remainingEnemies.splice(hitEnemyIndex, 1);
              remainingLasers = remainingLasers.filter(l => l.id !== laser.id);
              setScore(s => s + 15);
            }
          });

          return remainingEnemies;
        });

        return remainingLasers;
      });

    }, 50);

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
            🚀
          </div>

          <h2 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '1.6rem',
            color: '#fff',
            textShadow: '0 0 12px var(--neon-cyan)'
          }}>
            חלליות ניאון
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
              הזיזו את החללית שמאלה וימינה, ירו בלייזרים והשמידו את ספינות האויב הנופלות לפני שהן מגיעות לתחתית!
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

  // GAMEOVER VIEW
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
        <div style={{ fontSize: '3rem' }}>👾</div>

        <h2 style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '1.8rem',
          color: '#f43f5e',
          textShadow: '0 0 15px #f43f5e'
        }}>
          החללית נהרסה!
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

  // PLAYING SPACE BLASTER VIEW
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
      {/* Top Status Bar */}
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

        <div style={{ display: 'flex', gap: '4px', color: '#f43f5e' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} size={16} fill={i < lives ? '#f43f5e' : 'none'} opacity={i < lives ? 1 : 0.3} />
          ))}
        </div>

        <div style={{ fontFamily: 'var(--font-arcade)', color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>
          ניקוד: {score}
        </div>
      </div>

      {/* Main Shooter Game Screen */}
      <div style={{
        width: `${GAME_WIDTH}px`,
        height: `${GAME_HEIGHT}px`,
        background: '#030614',
        border: '2px solid var(--neon-cyan)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
      }}>
        {/* Lasers */}
        {lasers.map(laser => (
          <div
            key={laser.id}
            style={{
              position: 'absolute',
              left: `${laser.x}px`,
              top: `${laser.y}px`,
              width: '6px',
              height: '14px',
              background: '#00f0ff',
              borderRadius: '3px',
              boxShadow: '0 0 8px #00f0ff'
            }}
          />
        ))}

        {/* Enemies */}
        {enemies.map(enemy => (
          <div
            key={enemy.id}
            style={{
              position: 'absolute',
              left: `${enemy.x}px`,
              top: `${enemy.y}px`,
              width: '26px',
              height: '22px',
              background: '#f43f5e',
              borderRadius: '6px',
              boxShadow: '0 0 10px #f43f5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem'
            }}
          >
            👾
          </div>
        ))}

        {/* Player Ship */}
        <div
          style={{
            position: 'absolute',
            left: `${playerX}px`,
            bottom: '10px',
            width: `${SHIP_WIDTH}px`,
            height: '24px',
            background: 'linear-gradient(180deg, #00f0ff 0%, #2563eb 100%)',
            borderRadius: '8px 8px 4px 4px',
            boxShadow: '0 0 15px #00f0ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🚀
        </div>
      </div>

      {/* Touch Controls */}
      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '280px' }}>
        <button
          onClick={() => setPlayerX(x => Math.max(0, x - 24))}
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
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={fireLaser}
          style={{
            flex: 1.5,
            padding: '12px 0',
            background: 'linear-gradient(90deg, #00f0ff 0%, #3b82f6 100%)',
            border: 'none',
            color: '#050814',
            fontFamily: 'var(--font-arcade)',
            fontWeight: '900',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.5)'
          }}
        >
          <Zap size={18} fill="#050814" />
          <span>אש!</span>
        </button>

        <button
          onClick={() => setPlayerX(x => Math.min(GAME_WIDTH - SHIP_WIDTH, x + 24))}
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
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
