import React from 'react';
import { Home, Gamepad2, Trophy, Heart, User } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { id: 'ranks', label: 'Scores', icon: Trophy },
    { id: 'favs', label: 'Saved', icon: Heart },
    { id: 'profile', label: 'Player', icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <IconComponent size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
