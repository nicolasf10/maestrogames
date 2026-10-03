import React from 'react';
import { Star, Play } from 'lucide-react';
import { getGameArtworkComponent } from './ArcadeArtworks';

export const GameCard = ({ game, onSelectGame }) => {
  return (
    <div 
      className="game-card neon-box"
      onClick={() => onSelectGame(game)}
    >
      {/* Top Badge */}
      <div className={`card-badge ${game.badgeType === 'hot' ? 'hot' : ''}`}>
        {game.badge}
      </div>

      {/* SVG Graphic Thumbnail */}
      <div className="card-artwork-wrapper">
        {getGameArtworkComponent(game.artworkKey)}
        <div className="artwork-glow-overlay" />
      </div>

      {/* Info & Metadata */}
      <div className="card-info">
        <h3 className="card-title">{game.title}</h3>
        
        <div className="card-meta">
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {game.category}
          </span>
          <div className="card-rating">
            <Star size={10} fill="var(--neon-yellow)" stroke="none" />
            <span>{game.rating}</span>
          </div>
        </div>

        {/* Play Action Button */}
        <button className="card-action-btn">
          <Play size={10} fill="currentColor" />
          <span>PLAY</span>
        </button>
      </div>
    </div>
  );
};
