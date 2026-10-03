import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, Play, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const CARD_ICONS = ['⚡', '💻', '🚀', '🛡️', '🎖️', '🔑', '👾', '🎯'];

export const MemoryGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('INTRO'); // 'INTRO' | 'PLAYING' | 'VICTORY'
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const deck = [...CARD_ICONS, ...CARD_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon
      }));
    setCards(deck);
    setFlippedCards([]);
    setMatchedIds([]);
    setMoves(0);
    setGameState('PLAYING');
  };

  const handleCardClick = (id) => {
    if (gameState !== 'PLAYING') return;
    if (flippedCards.length === 2 || flippedCards.includes(id) || matchedIds.includes(id)) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      const card1 = cards.find(c => c.id === firstId);
      const card2 = cards.find(c => c.id === secondId);

      if (card1.icon === card2.icon) {
        setMatchedIds(prev => {
          const updated = [...prev, firstId, secondId];
          if (updated.length === cards.length) {
            setTimeout(() => {
              setGameState('VICTORY');
              confetti({ particleCount: 50, spread: 70 });
            }, 400);
          }
          return updated;
        });
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 900);
      }
    }
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
            🧠
          </div>

          <h2 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '1.6rem',
            color: '#fff',
            textShadow: '0 0 12px var(--neon-cyan)'
          }}>
            זיכרון פיקסל
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
              הפכו את הפיקסלים, זכרו את המיקומים ומצאו את כל הזוגות התואמים במספר המהלכים המינימלי!
            </p>
          </div>
        </div>

        <button
          onClick={initGame}
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

  // VICTORY VIEW
  if (gameState === 'VICTORY') {
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
        <div style={{ fontSize: '3rem' }}>🏆</div>

        <h2 style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '1.8rem',
          color: '#4ade80',
          textShadow: '0 0 15px #4ade80'
        }}>
          !כל הכבוד
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
          <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>סיימתם ב-</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--neon-cyan)', fontFamily: 'var(--font-arcade)' }}>
            {moves} מהלכים!
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
          <button
            onClick={initGame}
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

  // PLAYING MEMORY VIEW
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
          מהלכים: {moves}
        </div>
      </div>

      {/* 4x4 Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 62px)',
        gridTemplateRows: 'repeat(4, 62px)',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {cards.map(card => {
          const isFlipped = flippedCards.includes(card.id) || matchedIds.includes(card.id);
          const isMatched = matchedIds.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                width: '62px',
                height: '62px',
                borderRadius: '12px',
                background: isMatched
                  ? 'rgba(34, 197, 94, 0.2)'
                  : isFlipped
                  ? 'rgba(0, 240, 255, 0.25)'
                  : 'rgba(15, 23, 42, 0.85)',
                border: isMatched
                  ? '2px solid #4ade80'
                  : isFlipped
                  ? '2px solid var(--neon-cyan)'
                  : '1px solid rgba(0, 240, 255, 0.3)',
                boxShadow: isFlipped ? '0 0 10px rgba(0, 240, 255, 0.4)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isFlipped ? card.icon : '❓'}
            </div>
          );
        })}
      </div>
    </div>
  );
};
