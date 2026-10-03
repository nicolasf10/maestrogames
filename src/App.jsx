import React, { useState, useEffect } from 'react';
import './App.css';
import { GAMES_LIST } from './data/gamesData';
import { Header } from './components/Header';
import { GameGrid } from './components/GameGrid';
import { HeadsUpGame } from './components/games/HeadsUpGame';
import { PantomimeGame } from './components/games/PantomimeGame';
import { MusicGuessGame } from './components/games/MusicGuessGame';
import { Smartphone, Monitor, Wifi, Battery } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('MENU'); // 'MENU' | 'HEADS_UP' | 'PANTOMIME' | 'MUSIC_GUESS'
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Clock for mobile status notch
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    switch (game.id) {
      case 'heads-up':
        setActiveView('HEADS_UP');
        break;
      case 'pantomime':
        setActiveView('PANTOMIME');
        break;
      case 'music-guess':
        setActiveView('MUSIC_GUESS');
        break;
      default:
        setActiveView('MENU');
        break;
    }
  };

  const handleBackToMenu = () => {
    setActiveView('MENU');
    setSelectedGame(null);
  };

  return (
    <div className="app-container">
      {/* Desktop Mode Toggle Button */}
      <button 
        className="view-toggle-btn"
        onClick={() => setIsFullScreen(!isFullScreen)}
      >
        {isFullScreen ? (
          <>
            <Smartphone size={14} />
            <span>Phone View</span>
          </>
        ) : (
          <>
            <Monitor size={14} />
            <span>Full Width</span>
          </>
        )}
      </button>

      {/* Main Smartphone Shell */}
      <main className={`phone-frame ${isFullScreen ? 'full-screen' : ''}`}>
        {/* Phone Notch Bar */}
        <div className="phone-notch">
          <span>{currentTime || '12:00'}</span>
          <div className="notch-pill" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={12} />
            <Battery size={12} />
          </div>
        </div>

        {/* Screen Content Body */}
        <div className="screen-content">
          {activeView === 'MENU' && (
            <>
              <Header />
              <GameGrid 
                games={GAMES_LIST} 
                onSelectGame={handleSelectGame} 
              />
            </>
          )}

          {activeView === 'HEADS_UP' && (
            <HeadsUpGame onBack={handleBackToMenu} />
          )}

          {activeView === 'PANTOMIME' && (
            <PantomimeGame onBack={handleBackToMenu} />
          )}

          {activeView === 'MUSIC_GUESS' && (
            <MusicGuessGame onBack={handleBackToMenu} />
          )}
        </div>
      </main>
    </div>
  );
}
