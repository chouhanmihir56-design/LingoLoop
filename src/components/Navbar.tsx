import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';
import {
  Flame,
  Heart,
  Gem,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
  BookOpen,
  Trophy,
  Dumbbell,
  User,
  Home,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { playSound } from '../utils/audio';

export const Navbar: React.FC = () => {
  const {
    user,
    currentView,
    setCurrentView,
    selectLanguage,
    refillHearts,
    updateProfile,
    showToast,
  } = useApp();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [heartsDropdownOpen, setHeartsDropdownOpen] = useState(false);

  const currentLangInfo = LANGUAGES.find((l) => l.id === user.currentLanguage) || LANGUAGES[0];

  const handleNavClick = (view: 'home' | 'learn' | 'practice' | 'leaderboard' | 'profile' | 'blog') => {
    if (user.soundEnabled) playSound.tap();
    setCurrentView(view);
  };

  const toggleSound = () => {
    const nextSound = !user.soundEnabled;
    updateProfile({ soundEnabled: nextSound });
    showToast(nextSound ? 'Sound effects enabled 🔊' : 'Sound muted 🔇', 'info');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <svg
              className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 0 0-7.07 17.07l.07.07" />
              <path d="M12 22a10 10 0 0 0 7.07-17.07l-.07-.07" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              LingoLoop
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md">
              Beta
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'home'
                ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('learn')}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'learn'
                ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Learn</span>
          </button>

          <button
            onClick={() => handleNavClick('practice')}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'practice'
                ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Practice</span>
          </button>

          <button
            onClick={() => handleNavClick('leaderboard')}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'leaderboard'
                ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => handleNavClick('blog')}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'blog' || currentView === 'article'
                ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog</span>
          </button>

          <button
            onClick={() => handleNavClick('profile')}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'profile'
                ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>

        {/* Right Action Icons: Language Pill, Streak, Hearts, Gems, Sound */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-2xs text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all"
              title="Change language"
            >
              <span className="text-lg leading-none">{currentLangInfo.flag}</span>
              <span className="hidden sm:inline font-semibold text-xs tracking-wide">
                {currentLangInfo.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Languages
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        selectLanguage(lang.id);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-slate-50 transition-colors ${
                        lang.id === user.currentLanguage
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                      {lang.id === user.currentLanguage && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setLangDropdownOpen(false);
                      setCurrentView('languages');
                    }}
                    className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    + Explore all languages
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Streak Counter */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 font-bold text-sm select-none"
            title={`${user.streak}-Day Streak! Complete a lesson daily to keep it burning.`}
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{user.streak}</span>
          </div>

          {/* Gems */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200/60 text-sky-600 font-bold text-sm select-none"
            title={`${user.gems} Gems. Earn gems by finishing lessons & chests!`}
          >
            <Gem className="w-4 h-4 fill-sky-400 text-sky-500" />
            <span>{user.gems}</span>
          </div>

          {/* Hearts Dropdown */}
          <div className="relative">
            <button
              onClick={() => setHeartsDropdownOpen(!heartsDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600 font-bold text-sm hover:bg-rose-100/70 transition-all select-none"
              title={`${user.hearts}/${user.maxHearts} Hearts`}
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{user.hearts}</span>
            </button>

            {heartsDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-center"
                onMouseLeave={() => setHeartsDropdownOpen(false)}
              >
                <div className="flex justify-center mb-2">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: user.maxHearts }).map((_, idx) => (
                      <Heart
                        key={idx}
                        className={`w-6 h-6 ${
                          idx < user.hearts
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-slate-300 fill-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {user.hearts === user.maxHearts ? 'Hearts are Full!' : `${user.hearts} Hearts Left`}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mistakes in lessons cost 1 heart. Practice in the Practice Hub to earn hearts back!
                </p>
                {user.hearts < user.maxHearts && (
                  <button
                    onClick={() => {
                      refillHearts();
                      setHeartsDropdownOpen(false);
                    }}
                    className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Refill Hearts
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={user.soundEnabled ? 'Mute sound' : 'Enable sound'}
            aria-label="Toggle sound"
          >
            {user.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
