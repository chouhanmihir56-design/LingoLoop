import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  LanguageCode,
  UserProfile,
  LessonNode,
  LessonQuestion,
  Achievement,
  LeaderboardUser,
  UserMistake,
  Unit,
  LanguageProgressRecord,
} from '../types';
import { LANGUAGES } from '../data/languages';
import { INITIAL_ACHIEVEMENTS, INITIAL_LEADERBOARD_USERS } from '../data/achievements';
import { playSound } from '../utils/audio';
import { getFullCurriculum } from '../utils/lessonEngine';

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
  recordMistake: (question: LessonQuestion, userAnswer: string) => void;
  resolveMistake: (mistakeId: string) => void;
  recordTopicAttempt: (topic: string, isCorrect: boolean) => void;
  incrementEndlessRound: (earnedXp: number) => void;
  expandCurriculum: (count?: number) => void;
  currentCurriculum: Unit[];
  activeCompletedLessonIds: string[];
  activeLanguageLevel: number;
  achievements: Achievement[];
  leaderboardUsers: LeaderboardUser[];
  toasts: ToastInfo[];
  showToast: (message: string, type?: ToastInfo['type'], icon?: string) => void;
  dismissToast: (id: string) => void;
  resetProgress: () => void;
}

const DEFAULT_LANGUAGE_PROGRESS: Record<LanguageCode, LanguageProgressRecord> = {
  es: { completedLessonIds: ['es-u1-l1'], currentLevel: 3, xp: 245 },
  fr: { completedLessonIds: [], currentLevel: 1, xp: 0 },
  de: { completedLessonIds: [], currentLevel: 1, xp: 0 },
  ja: { completedLessonIds: [], currentLevel: 1, xp: 0 },
  ko: { completedLessonIds: [], currentLevel: 1, xp: 0 },
  it: { completedLessonIds: [], currentLevel: 1, xp: 0 },
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Mihir',
  username: '@mihir_c',
  avatar: '🦊',
  bio: 'Exploring languages and mastering endless quests with LingoLoop! 🌎✨',
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
  languageProgress: DEFAULT_LANGUAGE_PROGRESS,
  mistakesHistory: [],
  topicMastery: {
    greetings: { attempts: 12, correct: 11 },
    food: { attempts: 8, correct: 7 },
  },
  endlessRoundsCompleted: 2,
  stats: {
    vocabularyMastered: 24,
    speakingMinutes: 30,
    listeningExercises: 45,
    grammarQuizzes: 16,
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

const STORAGE_KEY = 'lingoloop_user_state_v2';
const ACHIEVEMENTS_KEY = 'lingoloop_achievements_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load and safely migrate profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('lingoloop_user_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Safe deep merge with default profile
        const langProg: Record<LanguageCode, LanguageProgressRecord> = {
          ...DEFAULT_LANGUAGE_PROGRESS,
          ...(parsed.languageProgress || {}),
        };

        // If old state had completedLessonIds on user root, ensure current language retains them
        const curLang: LanguageCode = parsed.currentLanguage || 'es';
        if (parsed.completedLessonIds && parsed.completedLessonIds.length > 0) {
          langProg[curLang] = {
            completedLessonIds: Array.from(new Set([...(langProg[curLang]?.completedLessonIds || []), ...parsed.completedLessonIds])),
            currentLevel: parsed.currentLevel || langProg[curLang]?.currentLevel || 1,
            xp: parsed.totalXp || langProg[curLang]?.xp || 0,
          };
        }

        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          languageProgress: langProg,
          mistakesHistory: parsed.mistakesHistory || [],
          topicMastery: parsed.topicMastery || DEFAULT_PROFILE.topicMastery,
          endlessRoundsCompleted: parsed.endlessRoundsCompleted || 0,
        };
      }
    } catch (e) {
      console.warn('LocalStorage load error, using default:', e);
    }
    return DEFAULT_PROFILE;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(ACHIEVEMENTS_KEY) || localStorage.getItem('lingoloop_achievements_v1');
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
    if (path === '/blog') return { view: 'blog', slug: null };
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

  // Navigation with URL pushState
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
    } catch {}
  };

  const openArticle = (slug: string) => {
    setCurrentArticleSlug(slug);
    setCurrentViewInternal('article');
    try {
      window.history.pushState({ view: 'article', slug }, '', `/blog/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  // Browser back/forward sync
  useEffect(() => {
    const handlePopState = () => {
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

  // Sync state to LocalStorage
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

  // Toast dispatch
  const showToast = useCallback((message: string, type: ToastInfo['type'] = 'info', icon?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Active language progression extraction
  const activeLangRecord: LanguageProgressRecord = useMemo(() => {
    const rec = user.languageProgress?.[user.currentLanguage];
    if (rec) return rec;
    return {
      completedLessonIds: user.completedLessonIds || [],
      currentLevel: user.currentLevel || 1,
      xp: user.totalXp || 0,
    };
  }, [user.languageProgress, user.currentLanguage, user.completedLessonIds, user.currentLevel, user.totalXp]);

  const activeCompletedLessonIds = activeLangRecord.completedLessonIds;
  const activeLanguageLevel = activeLangRecord.currentLevel;

  const [curriculumUnitsLimit, setCurriculumUnitsLimit] = useState<number>(16);

  const expandCurriculum = useCallback((count: number = 5) => {
    setCurriculumUnitsLimit((prev) => prev + count);
  }, []);

  // Infinite expandable curriculum for current language and level
  const currentCurriculum: Unit[] = useMemo(() => {
    return getFullCurriculum(
      user.currentLanguage,
      activeLanguageLevel,
      activeCompletedLessonIds,
      curriculumUnitsLimit
    );
  }, [user.currentLanguage, activeLanguageLevel, activeCompletedLessonIds, curriculumUnitsLimit]);

  const addXp = (amount: number, reason?: string) => {
    setUser((prev) => {
      const newTotal = prev.totalXp + amount;
      const newDaily = prev.dailyXp + amount;
      const newLevel = Math.floor(newTotal / 100) + 1;

      // Update current language progress as well
      const currentLang = prev.currentLanguage;
      const curProg = prev.languageProgress?.[currentLang] || {
        completedLessonIds: prev.completedLessonIds,
        currentLevel: prev.currentLevel,
        xp: 0,
      };

      const updatedLangProg: Record<LanguageCode, LanguageProgressRecord> = {
        ...(prev.languageProgress as Record<LanguageCode, LanguageProgressRecord>),
        [currentLang]: {
          ...curProg,
          xp: curProg.xp + amount,
          currentLevel: Math.max(curProg.currentLevel, Math.floor((curProg.xp + amount) / 100) + 1),
        },
      };

      if (newLevel > prev.currentLevel && prev.soundEnabled) {
        playSound.levelUp();
        showToast(`Level Up! You reached Level ${newLevel}! 🎉`, 'xp', '⭐');
      }

      return {
        ...prev,
        totalXp: newTotal,
        dailyXp: newDaily,
        currentLevel: Math.max(prev.currentLevel, newLevel),
        languageProgress: updatedLangProg,
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

  // Safe quest completion with duplicate-submission protection & per-language preservation
  const finishLesson = (lessonId: string, earnedXp: number, isPerfect: boolean) => {
    setUser((prev) => {
      const curLang = prev.currentLanguage;
      const curProg = prev.languageProgress?.[curLang] || {
        completedLessonIds: [],
        currentLevel: 1,
        xp: 0,
      };

      const isAlreadyCompleted = curProg.completedLessonIds.includes(lessonId);

      // If replaying a finished quest, give a balanced review reward (+10 XP) instead of full duplicate
      const effectiveXp = isAlreadyCompleted ? 10 : earnedXp;
      const gemsEarned = isAlreadyCompleted ? 5 : 20;

      const updatedCompleted = isAlreadyCompleted
        ? curProg.completedLessonIds
        : [...curProg.completedLessonIds, lessonId];

      const newLangXp = curProg.xp + effectiveXp;
      const newLangLevel = Math.max(curProg.currentLevel, Math.floor(newLangXp / 90) + 1);

      const updatedLangProg: Record<LanguageCode, LanguageProgressRecord> = {
        ...(prev.languageProgress as Record<LanguageCode, LanguageProgressRecord>),
        [curLang]: {
          completedLessonIds: updatedCompleted,
          currentLevel: newLangLevel,
          xp: newLangXp,
        },
      };

      const newTotalXp = prev.totalXp + effectiveXp;
      const newDailyXp = prev.dailyXp + effectiveXp;
      const newOverallLevel = Math.max(prev.currentLevel, Math.floor(newTotalXp / 100) + 1);

      return {
        ...prev,
        totalXp: newTotalXp,
        dailyXp: newDailyXp,
        gems: prev.gems + gemsEarned,
        currentLevel: newOverallLevel,
        completedLessonIds: updatedCompleted, // Keep backward compatibility
        languageProgress: updatedLangProg,
      };
    });

    // Unlock achievements
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
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const claimChest = (chestId: string, xpReward: number) => {
    const curLang = user.currentLanguage;
    const curProg = user.languageProgress?.[curLang] || { completedLessonIds: [] as string[] };

    if (curProg.completedLessonIds.includes(chestId)) {
      showToast('Chest already opened!', 'info', '🎁');
      return;
    }

    setUser((prev) => {
      const p: LanguageProgressRecord = (prev.languageProgress && prev.languageProgress[curLang]) || {
        completedLessonIds: [],
        currentLevel: 1,
        xp: 0,
      };
      const updatedProg = {
        ...prev.languageProgress,
        [curLang]: {
          ...p,
          completedLessonIds: [...p.completedLessonIds, chestId],
          xp: p.xp + xpReward,
        },
      };

      return {
        ...prev,
        gems: prev.gems + 50,
        totalXp: prev.totalXp + xpReward,
        languageProgress: updatedProg as Record<LanguageCode, LanguageProgressRecord>,
        completedLessonIds: [...prev.completedLessonIds, chestId],
      };
    });

    if (user.soundEnabled) playSound.fanfare();
    try {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.5 } });
    } catch {}
    showToast(`Claimed Milestone Chest! +50 Gems & +${xpReward} XP! 🎁`, 'success', '💎');
  };

  const selectLanguage = (lang: LanguageCode) => {
    setUser((prev) => ({
      ...prev,
      currentLanguage: lang,
    }));
    if (user.soundEnabled) playSound.tap();
    const l = LANGUAGES.find((item) => item.id === lang);
    showToast(`Switched learning path to ${l?.name || lang}! ${l?.flag || ''}`, 'info', '🌍');
    setCurrentView('learn');
  };

  const recordMistake = (question: LessonQuestion, userAnswer: string) => {
    setUser((prev) => {
      const history = prev.mistakesHistory || [];
      const existingIdx = history.findIndex((m) => m.question.id === question.id);
      let updated: UserMistake[];

      if (existingIdx >= 0) {
        updated = history.map((m, idx) =>
          idx === existingIdx
            ? { ...m, userAnswer, timestamp: Date.now(), reviewCount: m.reviewCount + 1, resolved: false }
            : m
        );
      } else {
        const newMistake: UserMistake = {
          id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          language: prev.currentLanguage,
          question,
          userAnswer,
          timestamp: Date.now(),
          reviewCount: 0,
          resolved: false,
        };
        updated = [newMistake, ...history].slice(0, 40);
      }

      return { ...prev, mistakesHistory: updated };
    });
  };

  const resolveMistake = (mistakeId: string) => {
    setUser((prev) => ({
      ...prev,
      mistakesHistory: (prev.mistakesHistory || []).map((m) =>
        m.id === mistakeId || m.question.id === mistakeId ? { ...m, resolved: true } : m
      ),
      gems: prev.gems + 5,
    }));
  };

  const recordTopicAttempt = (topic: string, isCorrect: boolean) => {
    setUser((prev) => {
      const current = prev.topicMastery || {};
      const existing = current[topic] || { attempts: 0, correct: 0 };
      return {
        ...prev,
        topicMastery: {
          ...current,
          [topic]: {
            attempts: existing.attempts + 1,
            correct: existing.correct + (isCorrect ? 1 : 0),
          },
        },
      };
    });
  };

  const incrementEndlessRound = (earnedXp: number) => {
    setUser((prev) => {
      const newRounds = (prev.endlessRoundsCompleted || 0) + 1;
      const newTotal = prev.totalXp + earnedXp;
      const newDaily = prev.dailyXp + earnedXp;
      const newLevel = Math.max(prev.currentLevel, Math.floor(newTotal / 100) + 1);

      return {
        ...prev,
        totalXp: newTotal,
        dailyXp: newDaily,
        gems: prev.gems + 15,
        endlessRoundsCompleted: newRounds,
        currentLevel: newLevel,
      };
    });
    if (user.soundEnabled) playSound.correct();
    showToast(`Round Completed! +${earnedXp} XP & +15 Gems! ⚡`, 'xp', '🏆');
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
      languageProgress: {
        es: { completedLessonIds: [], currentLevel: 1, xp: 0 },
        fr: { completedLessonIds: [], currentLevel: 1, xp: 0 },
        de: { completedLessonIds: [], currentLevel: 1, xp: 0 },
        ja: { completedLessonIds: [], currentLevel: 1, xp: 0 },
        ko: { completedLessonIds: [], currentLevel: 1, xp: 0 },
        it: { completedLessonIds: [], currentLevel: 1, xp: 0 },
      },
      mistakesHistory: [],
    });
    showToast('Progress reset to beginner status.', 'info', '🔄');
  };

  // Generate dynamic leaderboard with current user
  const leaderboardUsers: LeaderboardUser[] = useMemo(() => {
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
        recordMistake,
        resolveMistake,
        recordTopicAttempt,
        incrementEndlessRound,
        expandCurriculum,
        currentCurriculum,
        activeCompletedLessonIds,
        activeLanguageLevel,
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
