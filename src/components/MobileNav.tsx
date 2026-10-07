import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, BookOpen, Dumbbell, Trophy, User } from 'lucide-react';
import { playSound } from '../utils/audio';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, user, activeLesson } = useApp();

  // Hide mobile nav when actively in a lesson session for distraction-free focus
  if (activeLesson) return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Dumbbell },
    { id: 'leaderboard', label: 'Ranks', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  const handleClick = (id: typeof navItems[number]['id']) => {
    if (user.soundEnabled) playSound.tap();
    setCurrentView(id);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
