import React from 'react';
import { Gamepad2, X, Sparkles, Star, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GameModal = ({ game, onClose }) => {
  if (!game) return null;

  const handleInsertCoin = () => {
    // Trigger neon confetti blast on screen
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#3b82f6', '#f43f5e', '#fbbf24']
    });
  };

  return (
    <div className="arcade-modal-overlay" onClick={onClose}>
      <div className="arcade-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Icon */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div className="modal-icon-wrapper">
          <Gamepad2 size={32} />
        </div>

        <div>
          <h2 className="modal-title">{game.title}</h2>
          <p className="modal-subtitle">STAGE UNDER DEVELOPMENT</p>
        </div>

        <p className="modal-desc">
          {game.description}
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          background: 'rgba(0,0,0,0.3)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(0,240,255,0.1)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} fill="var(--neon-yellow)" stroke="none" /> {game.rating}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} /> {game.plays} Plays
          </span>
        </div>

        <div style={{
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px dashed rgba(0, 240, 255, 0.4)',
          borderRadius: '10px',
          padding: '10px',
          width: '100%',
          fontSize: '0.72rem',
          color: 'var(--neon-cyan)'
        }}>
          <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          Placeholder card ready! Custom games will be connected soon.
        </div>

        <button 
          className="modal-btn"
          onClick={() => {
            handleInsertCoin();
            setTimeout(onClose, 800);
          }}
        >
          INSERT COIN 🪙
        </button>
      </div>
    </div>
  );
};
