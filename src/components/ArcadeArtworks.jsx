import React from 'react';

// Custom Neon Blue Arcade Graphics for each Game Card
export const CyberSnakeArtwork = () => (
  <svg className="card-artwork-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#060c21" />
    {/* Grid line background */}
    <path d="M0 40H200M0 80H200M0 120H200M0 160H200M40 0V200M80 0V200M120 0V200M160 0V200" stroke="#00f0ff" strokeOpacity="0.08" strokeWidth="1" />
    {/* Glowing Snake */}
    <path d="M 40 160 H 120 V 100 H 80 V 40 H 160" stroke="#00f0ff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 0 10px #00f0ff)" />
    <path d="M 40 160 H 120 V 100 H 80 V 40 H 160" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Snake Food Target */}
    <circle cx="160" cy="80" r="10" fill="#f43f5e" filter="drop-shadow(0 0 8px #f43f5e)" />
    <circle cx="160" cy="80" r="4" fill="#ffffff" />
  </svg>
);

export const SpaceBlasterArtwork = () => (
  <svg className="card-artwork-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#04091a" />
    {/* Stars */}
    <circle cx="30" cy="40" r="1.5" fill="#38bdf8" opacity="0.8" />
    <circle cx="170" cy="30" r="2" fill="#00f0ff" opacity="0.9" />
    <circle cx="150" cy="160" r="1" fill="#ffffff" opacity="0.6" />
    <circle cx="40" cy="140" r="2" fill="#38bdf8" opacity="0.8" />
    {/* Lasers */}
    <line x1="85" y1="90" x2="85" y2="30" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" filter="drop-shadow(0 0 8px #00f0ff)" />
    <line x1="115" y1="90" x2="115" y2="30" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" filter="drop-shadow(0 0 8px #00f0ff)" />
    {/* Spaceship */}
    <polygon points="100,60 130,130 110,125 100,145 90,125 70,130" fill="#1e3a8a" stroke="#00f0ff" strokeWidth="3" filter="drop-shadow(0 0 12px #3b82f6)" />
    <polygon points="100,75 118,120 100,115 82,120" fill="#3b82f6" />
    <circle cx="100" cy="100" r="6" fill="#00f0ff" />
  </svg>
);

export const NeonBreakerArtwork = () => (
  <svg className="card-artwork-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#050a1d" />
    {/* Bricks */}
    <rect x="25" y="35" width="40" height="16" rx="4" fill="#3b82f6" stroke="#00f0ff" strokeWidth="1.5" filter="drop-shadow(0 0 6px #3b82f6)" />
    <rect x="80" y="35" width="40" height="16" rx="4" fill="#2563eb" stroke="#00f0ff" strokeWidth="1.5" filter="drop-shadow(0 0 6px #00f0ff)" />
    <rect x="135" y="35" width="40" height="16" rx="4" fill="#3b82f6" stroke="#00f0ff" strokeWidth="1.5" filter="drop-shadow(0 0 6px #3b82f6)" />
    
    <rect x="25" y="60" width="40" height="16" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
    <rect x="80" y="60" width="40" height="16" rx="4" fill="#f43f5e" stroke="#f43f5e" strokeWidth="1.5" filter="drop-shadow(0 0 8px #f43f5e)" />
    <rect x="135" y="60" width="40" height="16" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

    {/* Bouncing Ball */}
    <circle cx="100" cy="115" r="8" fill="#ffffff" filter="drop-shadow(0 0 10px #00f0ff)" />
    
    {/* Paddle */}
    <rect x="65" y="160" width="70" height="12" rx="6" fill="#00f0ff" filter="drop-shadow(0 0 12px #00f0ff)" />
  </svg>
);

export const RetroRacerArtwork = () => (
  <svg className="card-artwork-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#060b24" />
    {/* Perspective Grid Road */}
    <polygon points="20,200 85,100 115,100 180,200" fill="#0d1b3e" stroke="#00f0ff" strokeWidth="2" />
    <line x1="100" y1="100" x2="100" y2="200" stroke="#fbbf24" strokeWidth="4" strokeDasharray="12 12" />
    {/* Synthwave Sun */}
    <circle cx="100" cy="70" r="35" fill="url(#sunGrad)" />
    <defs>
      <linearGradient id="sunGrad" x1="100" y1="35" x2="100" y2="105" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" />
        <stop offset="1" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    {/* Cyber Sports Car */}
    <rect x="75" y="145" width="50" height="32" rx="6" fill="#2563eb" stroke="#00f0ff" strokeWidth="2" filter="drop-shadow(0 0 10px #00f0ff)" />
    <rect x="83" y="140" width="34" height="15" rx="4" fill="#00f0ff" opacity="0.8" />
    <circle cx="82" cy="177" r="6" fill="#030712" stroke="#00f0ff" />
    <circle cx="118" cy="177" r="6" fill="#030712" stroke="#00f0ff" />
  </svg>
);

export const CyberPongArtwork = () => (
  <svg className="card-artwork-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#070c26" />
    {/* Center Dividing Line */}
    <line x1="100" y1="0" x2="100" y2="200" stroke="#00f0ff" strokeWidth="2" strokeDasharray="8 8" opacity="0.4" />
    {/* Left Paddle */}
    <rect x="25" y="60" width="10" height="60" rx="5" fill="#00f0ff" filter="drop-shadow(0 0 10px #00f0ff)" />
    {/* Right Paddle */}
    <rect x="165" y="90" width="10" height="60" rx="5" fill="#3b82f6" filter="drop-shadow(0 0 10px #3b82f6)" />
    {/* Glowing Ball */}
    <circle cx="80" cy="110" r="9" fill="#ffffff" filter="drop-shadow(0 0 12px #00f0ff)" />
    {/* Motion Trail */}
    <path d="M40 90 Q 60 100 80 110" stroke="#00f0ff" strokeWidth="3" opacity="0.5" strokeDasharray="4 4" />
  </svg>
);

export const PixelMemoryArtwork = () => (
  <svg className="card-artwork-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#050a1f" />
    {/* Card Grid */}
    <rect x="30" y="30" width="60" height="60" rx="8" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" />
    <rect x="110" y="30" width="60" height="60" rx="8" fill="#00f0ff" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 0 10px #00f0ff)" />
    <rect x="30" y="110" width="60" height="60" rx="8" fill="#00f0ff" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 0 10px #00f0ff)" />
    <rect x="110" y="110" width="60" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />

    {/* Icons on Flipped Cards */}
    {/* Star on Card 2 */}
    <polygon points="140,45 144,55 155,55 146,62 149,72 140,65 131,72 134,62 125,55 136,55" fill="#050a1f" />
    {/* Star on Card 3 */}
    <polygon points="60,125 64,135 75,135 66,142 69,152 60,145 51,152 54,142 45,135 56,135" fill="#050a1f" />
  </svg>
);

export const LaserRunnerArtwork = () => (
  <svg className="card-artwork-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#050818" />
    <path d="M0 160 Q 100 140 200 160 V 200 H 0 Z" fill="#0e172a" stroke="#00f0ff" strokeWidth="2" />
    {/* Running Cyber Stick Figure */}
    <circle cx="100" cy="70" r="10" fill="#00f0ff" filter="drop-shadow(0 0 8px #00f0ff)" />
    <line x1="100" y1="80" x2="95" y2="120" stroke="#00f0ff" strokeWidth="5" strokeLinecap="round" />
    <line x1="95" y1="120" x2="70" y2="155" stroke="#00f0ff" strokeWidth="5" strokeLinecap="round" />
    <line x1="95" y1="120" x2="125" y2="150" stroke="#00f0ff" strokeWidth="5" strokeLinecap="round" />
    <line x1="100" y1="95" x2="75" y2="110" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
    <line x1="100" y1="95" x2="130" y2="85" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
    {/* Neon Obstacle */}
    <rect x="150" y="130" width="16" height="30" rx="4" fill="#f43f5e" filter="drop-shadow(0 0 10px #f43f5e)" />
  </svg>
);

export const CosmicBlocksArtwork = () => (
  <svg className="card-artwork-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#070d24" />
    {/* Tetris shapes */}
    {/* T Shape */}
    <rect x="40" y="60" width="30" height="30" rx="4" fill="#3b82f6" stroke="#00f0ff" strokeWidth="1.5" />
    <rect x="70" y="60" width="30" height="30" rx="4" fill="#3b82f6" stroke="#00f0ff" strokeWidth="1.5" />
    <rect x="100" y="60" width="30" height="30" rx="4" fill="#3b82f6" stroke="#00f0ff" strokeWidth="1.5" />
    <rect x="70" y="90" width="30" height="30" rx="4" fill="#3b82f6" stroke="#00f0ff" strokeWidth="1.5" />
    {/* Square Shape */}
    <rect x="110" y="110" width="30" height="30" rx="4" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #00f0ff)" />
    <rect x="140" y="110" width="30" height="30" rx="4" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #00f0ff)" />
    <rect x="110" y="140" width="30" height="30" rx="4" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #00f0ff)" />
    <rect x="140" y="140" width="30" height="30" rx="4" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #00f0ff)" />
  </svg>
);

// Map game artwork key to component
export const getGameArtworkComponent = (key) => {
  switch (key) {
    case 'snake': return <CyberSnakeArtwork />;
    case 'blaster': return <SpaceBlasterArtwork />;
    case 'breaker': return <NeonBreakerArtwork />;
    case 'racer': return <RetroRacerArtwork />;
    case 'pong': return <CyberPongArtwork />;
    case 'memory': return <PixelMemoryArtwork />;
    case 'runner': return <LaserRunnerArtwork />;
    case 'blocks': return <CosmicBlocksArtwork />;
    default: return <CyberSnakeArtwork />;
  }
};
