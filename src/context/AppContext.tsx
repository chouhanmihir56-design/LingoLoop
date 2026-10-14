import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  LanguageCode,
  UserProfile,
  LessonNode,
  Achievement,
  LeaderboardUser,
} from '../types';
import { LANGUAGES, LANGUAGE_CURRICULA } from '../data/languages';
import { INITIAL_ACHIEVEMENTS, INITIAL_LEADERBOARD_USERS } from '../data/achievements';
import { playSound } from '../utils/audio';

type ViewMode = 'home' | 'learn' | 'practice' | 'leaderboard' | 'profile' | 'languages' | 'blog' | 'article';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'xp' | 'streak' | 'heart' | 'info';
  icon?: string;
}

interface AppContextType {
  user: UserProfile;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  currentArticleSlug: string | null;
  openArticle: (slug: string) => void;
  activeLesson: LessonNode | null;
  startLesson: (lesson: LessonNode) => void;
  exitLesson: () => void;
  finishLesson: (lessonId: string, earnedXp: number, isPerfect: boolean) => void;
  loseHeart: () => boolean;
  refillHearts: () => void;
  addXp: (amount: number, reason?: string) => void;
  selectLanguage: (lang: LanguageCode) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  claimChest: (chestId: string, xpReward: number) => void;
  achievements: Achievement[];
  leaderboardUsers: LeaderboardUser[];
  toasts: ToastInfo[];
  showToast: (message: string, type?: ToastInfo['type'], icon?: string) => void;
  dismissToast: (id: string) => void;
  resetProgress: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Mihir',
  username: '@mihir_c',
  avatar: '🦊',
  bio: 'Learning new languages daily with LingoLoop! 🌎✨',
  currentLanguage: 'es',
  totalXp: 245,
  dailyXp: 20,
  dailyGoal: 30,
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  maxHearts: 5,
  gems: 260,
  completedLessonIds: ['es-u1-l1'],
  currentLevel: 3,
  unlockedBadgeIds: ['first_lesson', 'perfect_lesson', 'quick_thinker'],
  soundEnabled: true,
  ttsSpeed: 0.9,
  stats: {
    vocabularyMastered: 16,
    speakingMinutes: 24,
    listeningExercises: 38,
    grammarQuizzes: 12,
    weeklyActivity: [
      { day: 'Mon', xp: 35, targetReached: true },
      { day: 'Tue', xp: 45, targetReached: true },
      { day: 'Wed', xp: 30, targetReached: true },
      { day: 'Thu', xp: 50, targetReached: true },
      { day: 'Fri', xp: 40, targetReached: true },
      { day: 'Sat', xp: 25, targetReached: false },
      { day: 'Sun', xp: 20, targetReached: false },
    ],
  },
};

const STORAGE_KEY = 'lingoloop_user_state_v1';
const ACHIEVEMENTS_KEY = 'lingoloop_achievements_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Parse initial route from URL
  const getInitialRoute = (): { view: ViewMode; slug: string | null } => {
    if (typeof window === 'undefined') return { view: 'learn', slug: null };
    const path = window.location.pathname;
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '').split('/')[0];
      return { view: 'article', slug: slug || null };
    }
    if (path === '/blog') {
      return { view: 'blog', slug: null };
    }
    if (path === '/practice') return { view: 'practice', slug: null };
    if (path === '/leaderboard') return { view: 'leaderboard', slug: null };
    if (path === '/profile') return { view: 'profile', slug: null };
    if (path === '/languages') return { view: 'languages', slug: null };
    if (path === '/' || path === '/home') return { view: 'home', slug: null };
    return { view: 'learn', slug: null };
  };

  const initialRoute = getInitialRoute();
  const [currentView, setCurrentViewInternal] = useState<ViewMode>(initialRoute.view);
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(initialRoute.slug);
  const [activeLesson, setActiveLesson] = useState<LessonNode | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Navigate with clean URL pushState
  const setCurrentView = (view: ViewMode) => {
    setCurrentViewInternal(view);
    if (view !== 'article') {
      setCurrentArticleSlug(null);
    }
    try {
      const pathMap: Record<ViewMode, string> = {
        home: '/',
        learn: '/learn',
        practice: '/practice',
        leaderboard: '/leaderboard',
        profile: '/profile',
        languages: '/languages',
        blog: '/blog',
        article: currentArticleSlug ? `/blog/${currentArticleSlug}` : '/blog',
      };
      const newPath = pathMap[view] || '/';
      if (window.location.pathname !== newPath) {
        window.history.pushState({ view, slug: currentArticleSlug }, '', newPath);
      }
    } catch {
      // History API fallback
    }
  };

  const openArticle = (slug: string) => {
    setCurrentArticleSlug(slug);
    setCurrentViewInternal('article');
    try {
      window.history.pushState({ view: 'article', slug }, '', `/blog/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').split('/')[0];
        setCurrentArticleSlug(slug);
        setCurrentViewInternal('article');
      } else if (path === '/blog') {
        setCurrentArticleSlug(null);
        setCurrentViewInternal('blog');
      } else if (path === '/practice') {
        setCurrentViewInternal('practice');
      } else if (path === '/leaderboard') {
        setCurrentViewInternal('leaderboard');
      } else if (path === '/profile') {
        setCurrentViewInternal('profile');
      } else if (path === '/languages') {
        setCurrentViewInternal('languages');
      } else if (path === '/' || path === '/home') {
        setCurrentViewInternal('home');
      } else {
        setCurrentViewInternal('learn');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [achievements]);

  const showToast = (message: string, type: ToastInfo['type'] = 'info', icon?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addXp = (amount: number, reason?: string) => {
    setUser((prev) => {
      const newTotal = prev.totalXp + amount;
      const newDaily = prev.dailyXp + amount;
      const newLevel = Math.floor(newTotal / 100) + 1;

      if (newLevel > prev.currentLevel && prev.soundEnabled) {
        playSound.levelUp();
        showToast(`Level Up! You reached Level ${newLevel}! 🎉`, 'xp', '⭐');
      }

      return {
        ...prev,
        totalXp: newTotal,
        dailyXp: newDaily,
        currentLevel: Math.max(prev.currentLevel, newLevel),
      };
    });

    if (reason) {
      showToast(`+${amount} XP (${reason})`, 'xp', '⚡');
    }
  };

  const loseHeart = (): boolean => {
    let hasRemaining = true;
    setUser((prev) => {
      const remaining = Math.max(0, prev.hearts - 1);
      hasRemaining = remaining > 0;
      return {
        ...prev,
        hearts: remaining,
      };
    });
    return hasRemaining;
  };

  const refillHearts = () => {
    setUser((prev) => ({
      ...prev,
      hearts: prev.maxHearts,
    }));
    if (user.soundEnabled) playSound.fanfare();
    showToast('Hearts fully restored! ❤️❤️❤️❤️❤️', 'heart', '💖');
  };

  const startLesson = (lesson: LessonNode) => {
    setActiveLesson(lesson);
  };

  const exitLesson = () => {
    setActiveLesson(null);
  };

  const finishLesson = (lessonId: string, earnedXp: number, isPerfect: boolean) => {
    setUser((prev) => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];

      const newTotal = prev.totalXp + earnedXp;
      const newDaily = prev.dailyXp + earnedXp;
      const newLevel = Math.floor(newTotal / 100) + 1;

      return {
        ...prev,
        totalXp: newTotal,
        dailyXp: newDaily,
        gems: prev.gems + 15,
        completedLessonIds: newCompleted,
        currentLevel: Math.max(prev.currentLevel, newLevel),
      };
    });

    // Check achievement unlock logic
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'first_lesson' && !ach.unlocked) {
          return { ...ach, unlocked: true, progress: 1 };
        }
        if (ach.id === 'perfect_lesson' && isPerfect && !ach.unlocked) {
          return { ...ach, unlocked: true, progress: 1 };
        }
        if (ach.id === 'xp_500' && user.totalXp + earnedXp >= 500 && !ach.unlocked) {
          return { ...ach, unlocked: true, progress: 500 };
        }
        return ach;
      })
    );

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
  };

  const claimChest = (chestId: string, xpReward: number) => {
    if (user.completedLessonIds.includes(chestId)) return;
    setUser((prev) => ({
      ...prev,
      gems: prev.gems + 50,
      totalXp: prev.totalXp + xpReward,
      completedLessonIds: [...prev.completedLessonIds, chestId],
    }));
    if (user.soundEnabled) playSound.fanfare();
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    } catch {}
    showToast(`Claimed Chest! +50 Gems & +${xpReward} XP! 🎁`, 'success', '💎');
  };

  const selectLanguage = (lang: LanguageCode) => {
    setUser((prev) => {
      const targetLang = LANGUAGES.find((l) => l.id === lang);
      return {
        ...prev,
        currentLanguage: lang,
      };
    });
    if (user.soundEnabled) playSound.tap();
    const l = LANGUAGES.find((item) => item.id === lang);
    showToast(`Switched learning path to ${l?.name || lang}! ${l?.flag || ''}`, 'info', '🌍');
    setCurrentView('learn');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated successfully!', 'success', '✅');
  };

  const resetProgress = () => {
    setUser({
      ...DEFAULT_PROFILE,
      totalXp: 0,
      dailyXp: 0,
      streak: 1,
      completedLessonIds: [],
      currentLevel: 1,
      gems: 100,
      hearts: 5,
    });
    showToast('Progress reset to beginner status.', 'info', '🔄');
  };

  // Generate dynamic leaderboard with current user
  const leaderboardUsers: LeaderboardUser[] = React.useMemo(() => {
    const list = INITIAL_LEADERBOARD_USERS.map((u) => {
      if (u.isCurrentUser) {
        return {
          ...u,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          xp: user.totalXp,
          streak: user.streak,
          language: user.currentLanguage,
        };
      }
      return u;
    });

    // Sort by XP descending
    const sorted = [...list].sort((a, b) => b.xp - a.xp);
    return sorted.map((u, idx) => ({ ...u, rank: idx + 1 }));
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        currentView,
        setCurrentView,
        currentArticleSlug,
        openArticle,
        activeLesson,
        startLesson,
        exitLesson,
        finishLesson,
        loseHeart,
        refillHearts,
        addXp,
        selectLanguage,
        updateProfile,
        claimChest,
        achievements,
        leaderboardUsers,
        toasts,
        showToast,
        dismissToast,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
