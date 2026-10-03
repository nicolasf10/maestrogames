import React, { useState, useEffect, useRef } from 'react';
import { YOUTUBE_SONGS } from '../../data/youtubeSongs';
import { ArrowRight, Play, Volume2, Music, AlertCircle, HelpCircle, Sparkles, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

const SNIPPET_LEVELS = [0.5, 1, 2, 5, 10]; // seconds: 0.5s -> 1s -> 2s -> 5s -> 10s

export const MusicGuessGame = ({ onBack, customSongs = null }) => {
  const [gameState, setGameState] = useState('INTRO'); // 'INTRO' | 'PLAYING' | 'SOLVED' | 'REVEALED'
  const [selectedDifficulty, setSelectedDifficulty] = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
  const [songList, setSongList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(30);
  const [levelIndex, setLevelIndex] = useState(0); // 0 (0.5s), 1 (1s), 2 (2s), 3 (5s), 4 (10s)
  const [isPlayingSnippet, setIsPlayingSnippet] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'error' | 'success', message: '' }
  const [score, setScore] = useState(0);

  const playerRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize and filter song list by difficulty
  useEffect(() => {
    const list = customSongs && customSongs.length > 0 ? customSongs : YOUTUBE_SONGS;
    const filtered = selectedDifficulty === 'all'
      ? list
      : list.filter(song => song.difficulty === selectedDifficulty);

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setSongList(shuffled.length > 0 ? shuffled : list);
  }, [selectedDifficulty, customSongs]);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const currentSong = songList[currentIndex] || YOUTUBE_SONGS[0];
  const currentDuration = SNIPPET_LEVELS[levelIndex] || 0.5;

  // Load song at index
  const loadSong = (index) => {
    setCurrentIndex(index);
    setLevelIndex(0);
    setUserGuess('');
    setFeedback(null);
    setIsPlayingSnippet(false);

    // Pick random start timestamp between 20s and 80s
    const randomStart = Math.floor(Math.random() * 60) + 20;
    setStartTime(randomStart);

    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById({
        videoId: (songList[index] || YOUTUBE_SONGS[0]).id,
        startSeconds: randomStart
      });
      playerRef.current.pauseVideo();
    }
  };

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
    loadSong(0);
  };

  // Instantiate YouTube YT.Player when container mounts
  useEffect(() => {
    if (gameState === 'PLAYING' || gameState === 'SOLVED' || gameState === 'REVEALED') {
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player && !playerRef.current) {
          playerRef.current = new window.YT.Player('yt-hidden-player', {
            height: '180',
            width: '100%',
            videoId: currentSong.id,
            playerVars: {
              autoplay: 0,
              controls: 0,
              start: startTime
            },
            events: {
              onReady: (event) => {
                event.target.pauseVideo();
              }
            }
          });
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [gameState, currentSong, startTime]);

  // Play audio snippet for current level duration (0.5s -> 1s -> 2s -> 5s -> 10s)
  const playSnippet = () => {
    if (!playerRef.current || isPlayingSnippet) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    setIsPlayingSnippet(true);

    try {
      playerRef.current.seekTo(startTime, true);
      playerRef.current.playVideo();

      timerRef.current = setTimeout(() => {
        if (playerRef.current && playerRef.current.pauseVideo) {
          playerRef.current.pauseVideo();
        }
        setIsPlayingSnippet(false);
      }, currentDuration * 1000);
    } catch (err) {
      setIsPlayingSnippet(false);
    }
  };

  // Submit Guess Verification
  const handleSubmitGuess = (e) => {
    if (e) e.preventDefault();
    if (!userGuess.trim() || gameState !== 'PLAYING') return;

    const cleanedGuess = userGuess.trim().toLowerCase();
    const cleanedTitle = currentSong.title.toLowerCase();

    // Check if guess is included in video title or keywords
    const isTitleMatch = cleanedTitle.includes(cleanedGuess);
    const isKeywordMatch = currentSong.keywords && currentSong.keywords.some(k => k.toLowerCase().includes(cleanedGuess) || cleanedGuess.includes(k.toLowerCase()));

    if (isTitleMatch || isKeywordMatch) {
      // WINNER!
      if (playerRef.current && playerRef.current.playVideo) {
        playerRef.current.playVideo();
      }
      setScore(s => s + 1);
      setGameState('SOLVED');
      setFeedback({ type: 'success', message: '!כל הכבוד! זיהית את השיר בהצלחה' });
      confetti({ particleCount: 50, spread: 70 });
    } else {
      // WRONG GUESS -> Advance snippet duration level (0.5s -> 1s -> 2s -> 5s -> 10s)
      if (levelIndex < SNIPPET_LEVELS.length - 1) {
        const nextLevel = levelIndex + 1;
        setLevelIndex(nextLevel);
        setFeedback({
          type: 'error',
          message: `לא מדויק! הנה עוד זמן להקשיב: ${SNIPPET_LEVELS[nextLevel]} שניות`
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'עדיין לא מדויק! נסה שוב או לחץ על "חשוף תשובה".'
        });
      }
    }
  };

  // Reveal Answer / Give Up
  const handleGiveUp = () => {
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.seekTo(startTime, true);
      playerRef.current.playVideo();
    }
    setGameState('REVEALED');
  };

  // Next Song
  const handleNextSong = () => {
    if (currentIndex + 1 < songList.length) {
      setGameState('PLAYING');
      loadSong(currentIndex + 1);
    } else {
      const reshuffled = [...songList].sort(() => Math.random() - 0.5);
      setSongList(reshuffled);
      setGameState('PLAYING');
      loadSong(0);
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', width: '100%' }}>
          <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px #00f0ff)' }}>
            🎵
          </div>

          <h2 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '1.6rem',
            color: '#fff',
            textShadow: '0 0 12px var(--neon-cyan)'
          }}>
            ניחוש שירים
          </h2>

          {/* Difficulty Selector */}
          <div style={{ display: 'flex', gap: '6px', width: '100%', justifyContent: 'center' }}>
            {[
              { id: 'all', label: 'הכל' },
              { id: 'easy', label: '🟢 קל' },
              { id: 'medium', label: '🟡 בינוני' },
              { id: 'hard', label: '🔴 קשה' }
            ].map(diff => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '12px',
                  border: selectedDifficulty === diff.id ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.1)',
                  background: selectedDifficulty === diff.id ? 'rgba(0, 240, 255, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  color: selectedDifficulty === diff.id ? 'var(--neon-cyan)' : 'var(--text-dim)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {diff.label}
              </button>
            ))}
          </div>

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
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            width: '100%'
          }}>
            <p style={{ fontWeight: 'bold', color: 'var(--neon-cyan)' }}>
              איך משחקים?
            </p>
            <ol style={{ textAlign: 'right', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>שומעים קטע קצרצר משיר מתוך יוטיוב.</li>
              <li>השמעה ראשונה: **0.5 שניות (חצי שנייה)** בלבד!</li>
              <li>ניחוש לא נכון מעלה את הזמן: **0.5s ⬅️ 1s ⬅️ 2s ⬅️ 5s ⬅️ 10s**!</li>
              <li>מנחשים את שם השיר או האמן ומנצחים בסיבוב!</li>
            </ol>
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

  // PLAYING / SOLVED / REVEALED GAMEPLAY VIEW
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      padding: '14px 10px',
      direction: 'rtl'
    }}>
      {/* Top Header */}
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
          שירים שנחשפו: {score}
        </div>
      </div>

      {/* Main Music Guessing Card */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(145deg, rgba(13, 22, 48, 0.95) 0%, rgba(20, 35, 75, 0.9) 100%)',
        border: '2px solid var(--neon-cyan)',
        borderRadius: '20px',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)'
      }}>
        {/* YouTube Container (Hidden during guess, visible after win/reveal) */}
        <div style={{
          width: '100%',
          display: gameState === 'SOLVED' || gameState === 'REVEALED' ? 'block' : 'none',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--neon-cyan)'
        }}>
          <div id="yt-hidden-player" />
        </div>

        {gameState === 'PLAYING' && (
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isPlayingSnippet ? 'rgba(0, 240, 255, 0.25)' : 'rgba(0, 240, 255, 0.1)',
            border: '2px solid var(--neon-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--neon-cyan)',
            boxShadow: isPlayingSnippet ? '0 0 25px var(--neon-cyan)' : '0 0 10px rgba(0, 240, 255, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            <Music size={40} className={isPlayingSnippet ? 'animate-pulse-glow' : ''} />
          </div>
        )}

        {/* Level Indicator Badge */}
        {gameState === 'PLAYING' && (
          <div style={{
            background: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid var(--neon-cyan)',
            padding: '4px 14px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            color: 'var(--neon-cyan)',
            fontWeight: 'bold'
          }}>
            זמן השמעה: {currentDuration} שניות (רמה {levelIndex + 1}/5)
          </div>
        )}

        {/* Play Snippet Button */}
        {gameState === 'PLAYING' && (
          <button
            onClick={playSnippet}
            disabled={isPlayingSnippet}
            style={{
              width: '100%',
              padding: '12px 0',
              background: isPlayingSnippet
                ? 'rgba(0, 240, 255, 0.3)'
                : 'linear-gradient(90deg, #00f0ff 0%, #3b82f6 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#050814',
              fontFamily: 'var(--font-arcade)',
              fontSize: '0.95rem',
              fontWeight: '900',
              cursor: isPlayingSnippet ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)'
            }}
          >
            {isPlayingSnippet ? <Volume2 size={18} /> : <Play size={18} fill="#050814" />}
            <span>{isPlayingSnippet ? 'משמיע שיר...' : `נגן קטע (${currentDuration}s)`}</span>
          </button>
        )}

        {/* Revealed Title on Solve/Give-Up */}
        {(gameState === 'SOLVED' || gameState === 'REVEALED') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--neon-yellow)', fontWeight: 'bold' }}>
              {gameState === 'SOLVED' ? '🎉 זיהית את השיר!' : '💡 התשובה היא:'}
            </span>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 'bold' }}>
              {currentSong.title}
            </h3>
          </div>
        )}

        {/* Feedback Message */}
        {feedback && gameState === 'PLAYING' && (
          <div style={{
            fontSize: '0.78rem',
            color: feedback.type === 'error' ? '#f87171' : '#4ade80',
            background: 'rgba(0,0,0,0.4)',
            padding: '6px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertCircle size={14} />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Input Form for Guess */}
        {gameState === 'PLAYING' && (
          <form onSubmit={handleSubmitGuess} style={{ width: '100%', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="הקלד את שם השיר או הזמר..."
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--neon-cyan)',
                border: 'none',
                color: '#050814',
                padding: '0 16px',
                borderRadius: '10px',
                fontFamily: 'var(--font-arcade)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              בדוק
            </button>
          </form>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
        {gameState === 'PLAYING' && (
          <button
            onClick={handleGiveUp}
            style={{
              width: '100%',
              padding: '10px 0',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <HelpCircle size={16} />
            <span>חשוף תשובה</span>
          </button>
        )}

        {(gameState === 'SOLVED' || gameState === 'REVEALED') && (
          <button
            onClick={handleNextSong}
            style={{
              width: '100%',
              padding: '12px 0',
              background: 'linear-gradient(90deg, #00f0ff 0%, #3b82f6 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#050814',
              fontFamily: 'var(--font-arcade)',
              fontSize: '0.95rem',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} />
            <span>שיר הבא!</span>
          </button>
        )}
      </div>
    </div>
  );
};
