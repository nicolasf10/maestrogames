import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export const PlaceholderGameView = ({ game, onBack }) => {
  if (!game) return null;

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
      {/* Back button */}
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

      {/* Game Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px #00f0ff)' }}>
          🕹️
        </div>

        <h2 style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '1.6rem',
          color: '#fff',
          textShadow: '0 0 12px var(--neon-cyan)'
        }}>
          {game.hebrewTitle || game.title}
        </h2>

        <div style={{
          background: 'rgba(13, 22, 48, 0.85)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '16px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontSize: '0.9rem',
          color: '#e2e8f0',
          lineHeight: '1.6',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        }}>
          <p style={{ fontWeight: 'bold', color: 'var(--neon-cyan)' }}>
            הסבר על המשחק:
          </p>
          <p style={{ textAlign: 'right' }}>
            {game.hebrewDesc || game.description}
          </p>
        </div>
      </div>

      {/* Start Button */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={() => alert(`משחק ${game.hebrewTitle || game.title} יחל בקרוב!`)}
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
          <span>התחל משחק</span>
        </button>
      </div>
    </div>
  );
};
