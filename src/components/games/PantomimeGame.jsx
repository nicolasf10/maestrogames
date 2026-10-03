import React, { useState } from 'react';
import { PANTOMIME_PROMPTS } from '../../data/hebrewWordBank';
import { ArrowRight, RefreshCw, Play, Theater } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PantomimeGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('INTRO'); // 'INTRO' | 'PLAYING'
  const [currentIndex, setCurrentIndex] = useState(0);

  const startGame = () => {
    const randomIdx = Math.floor(Math.random() * PANTOMIME_PROMPTS.length);
    setCurrentIndex(randomIdx);
    setGameState('PLAYING');
  };

  const nextPrompt = () => {
    let nextIdx = Math.floor(Math.random() * PANTOMIME_PROMPTS.length);
    if (nextIdx === currentIndex && PANTOMIME_PROMPTS.length > 1) {
      nextIdx = (currentIndex + 1) % PANTOMIME_PROMPTS.length;
    }
    setCurrentIndex(nextIdx);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const currentPrompt = PANTOMIME_PROMPTS[currentIndex] || PANTOMIME_PROMPTS[0];

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
        {/* Navigation */}
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

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px #00f0ff)' }}>
            🎭
          </div>

          <h2 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '1.6rem',
            color: '#fff',
            textShadow: '0 0 12px var(--neon-cyan)'
          }}>
            פנטומימה
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
            <ol style={{ textAlign: 'right', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>שחקן אחד מקבל שם של מישהו.</li>
              <li>מציגים אותו בפנטומימה **בלי לדבר ובלי להוציא קול**!</li>
              <li>החבר הראשון שמנחש נכון מנצח בסיבוב!</li>
              <li>לוחצים על "אדם הבא" וממשיכים לשחק.</li>
            </ol>
          </div>
        </div>

        {/* Start Button */}
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
            letterSpacing: '1px',
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

  // PLAYING / CARD DISPLAY VIEW
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
      {/* Navigation Header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowRight size={14} />
          <span>יציאה</span>
        </button>
      </div>

      {/* Main Person Card */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(145deg, rgba(13, 22, 48, 0.95) 0%, rgba(20, 35, 75, 0.9) 100%)',
        border: '2px solid var(--neon-cyan)',
        borderRadius: '24px',
        padding: '36px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.35)',
        alignItems: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(0, 240, 255, 0.15)',
          border: '1px solid var(--neon-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--neon-cyan)',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
        }}>
          <Theater size={30} />
        </div>

        {/* Person Name Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            אתה מציג את:
          </span>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: '900',
            color: '#ffffff',
            textShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4)',
            fontFamily: 'var(--font-arcade)',
            lineHeight: '1.2'
          }}>
            {currentPrompt.name}
          </h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={nextPrompt}
          style={{
            width: '100%',
            padding: '14px 0',
            background: 'linear-gradient(90deg, #00f0ff 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '14px',
            color: '#050814',
            fontFamily: 'var(--font-arcade)',
            fontSize: '1rem',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={18} />
          <span>אדם הבא!</span>
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
          סיום וחזרה לתפריט
        </button>
      </div>
    </div>
  );
};
