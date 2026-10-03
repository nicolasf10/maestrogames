import React from 'react';
import { GameCard } from './GameCard';

export const GameGrid = ({ games, onSelectGame }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* 2-Column Grid */}
      <div className="game-grid">
        {games.map(game => (
          <GameCard 
            key={game.id} 
            game={game} 
            onSelectGame={onSelectGame} 
          />
        ))}
      </div>
    </div>
  );
};
