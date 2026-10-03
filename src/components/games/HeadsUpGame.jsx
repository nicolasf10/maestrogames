import React, { useState, useEffect } from 'react';
import { HEADS_UP_WORDS } from '../../data/hebrewWordBank';
import { ArrowRight, RotateCcw, Play, CheckCircle2, XCircle, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

export const HeadsUpGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('INTRO'); // 'INTRO' | 'PLAYING' | 'ENDED'
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [skips, setSkips] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashFeedback, setFlashFeedback] = useState(null); // 'correct' | 'skip' | null

  // Shuffle words helper
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const shuffled = shuffleArray(HEADS_UP_WORDS);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSkips(0);
    setTimeLeft(60);
    setGameState('PLAYING');
  };

  // Timer Countdown
  useEffect(() => {
    let interval = null;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'PLAYING') {
      setGameState('ENDED');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Handle Correct (Right Side Touch)
  const handleCorrect = (e) => {
    if (e) e.stopPropagation();
    if (gameState !== 'PLAYING') return;

    setScore(prev => prev + 1);
    triggerFlash('correct');
    nextWord();
  };

  // Handle Skip (Left Side Touch)
  const handleSkip = (e) => {
    if (e) e.stopPropagation();
    if (gameState !== 'PLAYING') return;

    setSkips(prev => prev + 1);
    triggerFlash('skip');
    nextWord();
  };

  const nextWord = () => {
    if (currentIndex + 1 < shuffledWords.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Reshuffle if reached end of list
      setShuffledWords(shuffleArray(HEADS_UP_WORDS));
      setCurrentIndex(0);
    }
  };

  const triggerFlash = (type) => {
    setFlashFeedback(type);
    setTimeout(() => {
      setFlashFeedback(null);
    }, 250);
  };

  const currentWordObj = shuffledWords[currentIndex] || HEADS_UP_WORDS[0];

  // RENDER 1: INTRO / EXPLANATION SCREEN
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
        {/* Top Navigation */}
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

        {/* Game Title & Explanation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{
            fontSize: '2.5rem',
            filter: 'drop-shadow(0 0 10px #00f0ff)'
          }}>
            📱
          </div>

          <h2 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '1.6rem',
            color: '#fff',
            textShadow: '0 0 12px var(--neon-cyan)'
          }}>
            אליאס
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
              <li>מחזיקים את הטלפון **לרוחב** מעל המצח!</li>
              <li>החברים מולכם מנסים להסביר את המילה המופיעה על המסך.</li>
              <li>
                <span style={{ color: '#4ade80', fontWeight: 'bold' }}>נגיעה במימין (ירוק):</span> הצלחתם! (+1 נקודה)
              </li>
              <li>
                <span style={{ color: '#f87171', fontWeight: 'bold' }}>נגיעה משמאל (אדום):</span> דילוג למילה הבאה.
              </li>
              <li>כל סיבוב נמשך **60 שניות** בדיוק.</li>
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

  // RENDER 2: PLAYING LANDSCAPE GAME VIEW
  if (gameState === 'PLAYING') {
    return (
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: flashFeedback === 'correct' 
            ? 'rgba(34, 197, 94, 0.85)' 
            : flashFeedback === 'skip' 
            ? 'rgba(239, 68, 68, 0.85)' 
            : '#05091a',
          transition: 'background 0.15s ease',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 90,
          userSelect: 'none',
          direction: 'rtl'
        }}
      >
        {/* Top Header: Timer & Current Score Bar */}
        <div style={{
          height: '50px',
          background: 'rgba(3, 7, 18, 0.8)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontFamily: 'var(--font-arcade)',
          color: '#fff'
        }}>
          {/* Exit / Abort */}
          <button 
            onClick={() => setGameState('INTRO')}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--text-dim)',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            יציאה
          </button>

          {/* Timer Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: timeLeft <= 10 ? '#f43f5e' : 'var(--neon-cyan)',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            <Timer size={18} />
            <span>{timeLeft}s</span>
          </div>

          {/* Score Counter */}
          <div style={{ fontSize: '0.9rem', color: '#4ade80' }}>
            נקודות: {score}
          </div>
        </div>

        {/* Center Main Screen Divided Into 2 Touch Zones */}
        <div style={{
          flex: 1,
          display: 'flex',
          position: 'relative'
        }}>
          {/* Left Touch Zone (SKIP / דילוג) */}
          <div 
            onClick={handleSkip}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingLeft: '20px',
              borderRight: '1px dashed rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'rgba(239, 68, 68, 0.7)',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              <XCircle size={16} />
              <span>שמאל = דילוג</span>
            </div>
          </div>

          {/* Right Touch Zone (CORRECT / נקודה!) */}
          <div 
            onClick={handleCorrect}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '20px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'rgba(34, 197, 94, 0.7)',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              <CheckCircle2 size={16} />
              <span>ימין = נכון!</span>
            </div>
          </div>

          {/* Centered Word Overlay Banner */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '20px'
          }}>
            <h1 style={{
              fontFamily: 'var(--font-arcade)',
              fontSize: '2.4rem',
              fontWeight: '900',
              color: '#ffffff',
              textAlign: 'center',
              textShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4)',
              lineHeight: '1.2'
            }}>
              {currentWordObj.word}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // RENDER 3: END OF ROUND SUMMARY SCREEN
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
        color: '#fff',
        textShadow: '0 0 15px var(--neon-cyan)'
      }}>
        נגמר הזמן!
      </h2>

      <div style={{
        background: 'rgba(13, 22, 48, 0.9)',
        border: '2px solid var(--neon-cyan)',
        borderRadius: '20px',
        padding: '20px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
          הניקוד הופק במילואים/בסייבר:
        </div>
        
        <div style={{
          fontSize: '3rem',
          fontWeight: '900',
          color: '#4ade80',
          fontFamily: 'var(--font-arcade)',
          textShadow: '0 0 15px #4ade80'
        }}>
          {score}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
          מילים שניחשתם בהצלחה! ({skips} דילוגים)
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
          חזרה לתפריט ראשי
        </button>
      </div>
    </div>
  );
};
