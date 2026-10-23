import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';
import { Mascot } from '../components/Mascot';
import { LessonNode, LanguageCode } from '../types';
import {
  Flame,
  Zap,
  Heart,
  Trophy,
  ArrowRight,
  Sparkles,
  Check,
  Lock,
  Gift,
  Star,
  Play,
  RotateCw,
  Compass,
  Award,
  ChevronRight,
  BookOpen,
  HelpCircle,
  AlertCircle,
  Crown,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { playSound } from '../utils/audio';

// Biome visual themes for the quest map
const BIOME_THEMES: Record<string, { name: string; bg: string; badge: string; border: string }> = {
  emerald: {
    name: 'Emerald Meadow',
    bg: 'from-emerald-950/60 via-slate-900 to-slate-900',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    border: 'border-emerald-500/20',
  },
  sapphire: {
    name: 'Sapphire Bay',
    bg: 'from-blue-950/60 via-slate-900 to-slate-900',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    border: 'border-blue-500/20',
  },
  citadel: {
    name: 'Golden Citadel',
    bg: 'from-amber-950/60 via-slate-900 to-slate-900',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    border: 'border-amber-500/20',
  },
  cyber: {
    name: 'Neon Cyberway',
    bg: 'from-purple-950/60 via-slate-900 to-slate-900',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    border: 'border-purple-500/20',
  },
  celestial: {
    name: 'Celestial Peaks',
    bg: 'from-indigo-950/60 via-slate-900 to-slate-900',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    border: 'border-indigo-500/20',
  },
};

export const DashboardView: React.FC = () => {
  const {
    user,
    startLesson,
    claimChest,
    setCurrentView,
    achievements,
    refillHearts,
    currentCurriculum,
    expandCurriculum,
    activeCompletedLessonIds,
    activeLanguageLevel,
    selectLanguage,
    showToast,
  } = useApp();

  const [langModalOpen, setLangModalOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.id === user.currentLanguage) || LANGUAGES[0];

  // Flatten all lessons across current curriculum
  const allLessons: LessonNode[] = currentCurriculum.flatMap((u) => u.lessons);

  // Completed count for current language
  const completedCount = allLessons.filter(
    (l) => l.type !== 'chest' && activeCompletedLessonIds.includes(l.id)
  ).length;

  const totalStandardLessons = allLessons.filter((l) => l.type !== 'chest').length || 1;
  const progressPercent = Math.min(100, Math.round((completedCount / totalStandardLessons) * 100));

  // Determine active next quest
  const nextLesson =
    allLessons.find((l) => l.type !== 'chest' && !activeCompletedLessonIds.includes(l.id)) ||
    allLessons[allLessons.length - 1];

  const handleStartContinue = () => {
    if (user.hearts <= 0) {
      refillHearts();
    }
    if (nextLesson) {
      if (user.soundEnabled) playSound.tap();
      startLesson(nextLesson);
    }
  };

  const handleNodeClick = (lesson: LessonNode, isLocked: boolean) => {
    if (isLocked) {
      if (user.soundEnabled) playSound.error();
      showToast('Complete preceding quests to unlock this challenge!', 'info', '🔒');
      return;
    }
    if (lesson.type === 'chest') {
      claimChest(lesson.id, lesson.xpReward);
      return;
    }
    if (user.hearts <= 0) {
      refillHearts();
    }
    if (user.soundEnabled) playSound.tap();
    startLesson(lesson);
  };

  const dailyGoalProgress = Math.min(100, Math.round((user.dailyXp / user.dailyGoal) * 100));

  // Count active unresolved mistakes
  const unresolvedMistakesCount = (user.mistakesHistory || []).filter(
    (m) => !m.resolved && m.language === user.currentLanguage
  ).length;

  // Assign biomes based on unit index
  const getBiomeKey = (unitIdx: number): string => {
    const keys = ['emerald', 'sapphire', 'citadel', 'cyber', 'celestial'];
    return keys[unitIdx % keys.length];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 selection:bg-purple-600 selection:text-white">
      {/* Top Banner Ribbon */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-18 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Greeting & Language Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all cursor-pointer group"
              title="Click to switch target language"
            >
              <span className="text-2xl">{currentLang.flag}</span>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300 flex items-center gap-1">
                  <span>{currentLang.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300" />
                </div>
                <div className="text-[10px] text-slate-400">Level {activeLanguageLevel} Explorer</div>
              </div>
            </button>

            <div className="hidden sm:block">
              <h1 className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-1.5">
                Hey, {user.name}! <span className="inline-block animate-wave">👋</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                {currentCurriculum.length} dynamic units unlocked • Infinite progression active
              </p>
            </div>
          </div>

          {/* Quick Stats bar */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
            {/* Daily Goal */}
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                🎯
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 tabular-nums">
                  {user.dailyXp}/{user.dailyGoal} XP
                </span>
                <div className="w-16 h-1.5 bg-slate-700 rounded-full mt-0.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${dailyGoalProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/30 text-orange-400 text-xs font-bold tabular-nums">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{user.streak} Days</span>
            </div>

            {/* Hearts with quick refill */}
            <button
              onClick={refillHearts}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 text-xs font-bold transition-all cursor-pointer"
              title="Click to restore full hearts"
            >
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>{user.hearts}/5</span>
            </button>

            {/* Gems */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-bold tabular-nums">
              <span>💎</span>
              <span>{user.gems}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Quest Map & Learning Path Column */}
          <main className="lg:col-span-8 space-y-8">
            {/* World-Class Hero Quest Banner */}
            <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-500/30 shadow-2xl shadow-purple-950/50 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-lg">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-purple-200 border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Up Next • {nextLesson?.stage || 'A1'} Quest</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                    {nextLesson?.title || 'Start Next Quest'}
                  </h2>

                  <p className="text-purple-200/90 text-xs sm:text-sm font-medium leading-relaxed">
                    {nextLesson?.description ||
                      'Master vocabulary, listening, and real dialogue through interactive challenges.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-purple-200 pt-1">
                    <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      <Zap className="w-3.5 h-3.5 fill-amber-300" /> +{nextLesson?.xpReward || 25} XP
                    </span>
                    <span>•</span>
                    <span>⏱ ~{nextLesson?.estimatedMinutes || 4} mins</span>
                    <span>•</span>
                    <span>Completed in {currentLang.name}: {completedCount} Quests</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2.5 w-full md:w-auto flex-shrink-0">
                  <button
                    onClick={handleStartContinue}
                    className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>Continue Quest</span>
                  </button>
                  <span className="text-[11px] text-purple-300/80 font-medium">
                    Continuous learning active • Never ends
                  </span>
                </div>
              </div>

              {/* Quick Jump Bar */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('practice')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5 border border-white/10"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Endless Practice Mode</span>
                  </button>

                  {unresolvedMistakesCount > 0 && (
                    <button
                      onClick={() => setCurrentView('practice')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-bold text-rose-300 transition-all flex items-center gap-1.5 border border-rose-500/30"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Review {unresolvedMistakesCount} Mistakes</span>
                    </button>
                  )}
                </div>

                <div className="text-xs text-purple-200/80 font-medium">
                  Proficiency: <span className="font-bold text-white">{currentLang.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Immersive Adventure Quest Map */}
            <div className="space-y-10">
              {currentCurriculum.map((unit, unitIdx) => {
                const biomeKey = getBiomeKey(unitIdx);
                const biome = BIOME_THEMES[biomeKey];
                const unitCompleted = unit.lessons.every(
                  (l) => l.type === 'chest' || activeCompletedLessonIds.includes(l.id)
                );

                return (
                  <section
                    key={unit.id}
                    className={`bg-slate-900/90 rounded-3xl p-6 sm:p-8 border ${biome.border} shadow-xl relative overflow-hidden`}
                  >
                    {/* Biome atmospheric background accent */}
                    <div
                      className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl ${biome.bg} rounded-full blur-3xl pointer-events-none opacity-50`}
                    />

                    {/* Unit & Biome Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${biome.badge}`}
                          >
                            {biome.name} • {unit.stage || `Stage ${unitIdx + 1}`}
                          </span>
                          {unitCompleted && (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Unit Mastered
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight mt-1">
                          {unit.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{unit.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-300">
                            {
                              unit.lessons.filter(
                                (l) => l.type !== 'chest' && activeCompletedLessonIds.includes(l.id)
                              ).length
                            }{' '}
                            / {unit.lessons.filter((l) => l.type !== 'chest').length} Quests
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">Progressive Path</div>
                        </div>
                      </div>
                    </div>

                    {/* Winding Quest Nodes Trail */}
                    <div className="relative max-w-md mx-auto py-4">
                      {/* Trail Connecting Line */}
                      <div className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-1.5 bg-slate-800 rounded-full z-0" />

                      <div className="space-y-10 relative z-10">
                        {unit.lessons.map((lesson, lessonIdx) => {
                          const isCompleted = activeCompletedLessonIds.includes(lesson.id);
                          const isChest = lesson.type === 'chest';
                          const isBoss = lesson.type === 'boss' || lesson.type === 'quiz';

                          // A lesson is unlocked if previous lesson is completed or if it's the very first lesson
                          const prevLesson = unit.lessons[lessonIdx - 1];
                          const isUnlocked =
                            lessonIdx === 0 ||
                            (prevLesson && activeCompletedLessonIds.includes(prevLesson.id)) ||
                            isCompleted;

                          const isCurrentActive =
                            !isCompleted && !isChest && isUnlocked && lesson.id === nextLesson?.id;

                          // Zig-zag offset for adventurous quest feel
                          const offsetClasses = [
                            'translate-x-0',
                            '-translate-x-12 sm:-translate-x-16',
                            'translate-x-12 sm:translate-x-16',
                            'translate-x-0',
                          ];
                          const offsetClass = offsetClasses[lessonIdx % offsetClasses.length];

                          return (
                            <div
                              key={lesson.id}
                              className={`flex flex-col items-center justify-center transition-all ${offsetClass}`}
                            >
                              <div className="relative group">
                                {/* Current Active Aura */}
                                {isCurrentActive && (
                                  <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full blur-md opacity-75 animate-pulse" />
                                )}

                                <button
                                  onClick={() => handleNodeClick(lesson, !isUnlocked)}
                                  disabled={!isUnlocked}
                                  className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all cursor-pointer ${
                                    isCompleted
                                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 border-2 border-yellow-200'
                                      : isCurrentActive
                                      ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white shadow-xl shadow-purple-600/40 hover:scale-110 border-2 border-white'
                                      : isChest
                                      ? 'bg-gradient-to-tr from-purple-800 to-indigo-900 text-amber-300 border-2 border-purple-500/50 hover:scale-105'
                                      : isUnlocked
                                      ? 'bg-slate-800 text-slate-200 border-2 border-slate-700 hover:border-purple-400 hover:scale-105'
                                      : 'bg-slate-800/60 text-slate-600 border border-slate-800 cursor-not-allowed opacity-60'
                                  }`}
                                  title={`${lesson.title} - ${lesson.description}`}
                                >
                                  {isCompleted ? (
                                    <Check className="w-8 h-8 stroke-[3]" />
                                  ) : isChest ? (
                                    <Gift className="w-8 h-8" />
                                  ) : isBoss ? (
                                    <Crown className="w-8 h-8 text-amber-400" />
                                  ) : isUnlocked ? (
                                    <Star className="w-7 h-7 fill-current" />
                                  ) : (
                                    <Lock className="w-6 h-6" />
                                  )}

                                  {/* Node Stage Indicator */}
                                  <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-black tracking-wider text-slate-300 uppercase shadow-xs">
                                    {isChest ? 'Reward' : `+${lesson.xpReward} XP`}
                                  </span>
                                </button>
                              </div>

                              {/* Title Tooltip Card below node */}
                              <div className="mt-3 text-center max-w-[200px]">
                                <h4
                                  className={`text-xs font-black truncate ${
                                    isCurrentActive
                                      ? 'text-emerald-400'
                                      : isCompleted
                                      ? 'text-amber-300'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {lesson.title}
                                </h4>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                                  {lesson.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              })}

              {/* Endless Horizon Node: Confirms learning never stops */}
              <div className="text-center p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/20 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/30">
                  <Compass className="w-7 h-7 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Infinite Learning Frontier</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    As you advance, LingoLoop dynamically generates high-level CEFR quests, idiom challenges,
                    and personalized revision. Learning has no artificial ceiling.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => expandCurriculum(5)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Generate +5 More Units ({currentCurriculum.length} Available)</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('practice')}
                    className="px-6 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-purple-300" />
                    <span>Launch Endless Practice</span>
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar Deck: Quick Actions, Quests, & Mastery */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Mascot Companion Encouragement */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-sm flex items-center gap-4">
              <div className="flex-shrink-0">
                <Mascot size="md" expression="happy" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">
                  Lingo Companion
                </h4>
                <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                  “Consistency beats intensity! Complete 1 quest every day to lock in your memory.”
                </p>
              </div>
            </div>

            {/* Daily Quests Card */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
                  <span>Daily Quests</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    Resets in 12h
                  </span>
                </h4>
              </div>

              <div className="space-y-3">
                {/* Quest 1 */}
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">Earn 30 XP Today</span>
                    <span className="font-bold text-purple-400 tabular-nums">
                      {Math.min(30, user.dailyXp)}/30 XP
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${dailyGoalProgress}%` }}
                    />
                  </div>
                </div>

                {/* Quest 2 */}
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">Complete 2 Quests</span>
                    <span className="font-bold text-emerald-400 tabular-nums">
                      {Math.min(2, completedCount)}/2
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (completedCount / 2) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Quest 3 */}
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">Review Past Mistakes</span>
                    <span className="font-bold text-amber-400 tabular-nums">
                      {unresolvedMistakesCount > 0 ? `${unresolvedMistakesCount} Queued` : 'All Clear ✨'}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentView('practice')}
                    className="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all text-center block"
                  >
                    Open Practice Hub
                  </button>
                </div>
              </div>
            </div>

            {/* Achievements Showcase */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-slate-100">Milestone Badges</h4>
                <button
                  onClick={() => setCurrentView('profile')}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {achievements.slice(0, 4).map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                      ach.unlocked
                        ? 'bg-amber-500/10 border-amber-500/30 shadow-xs'
                        : 'bg-slate-800/40 border-slate-800 opacity-50'
                    }`}
                    title={`${ach.title}: ${ach.description}`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <span className="text-[10px] font-bold text-slate-300 mt-1 truncate max-w-full">
                      {ach.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Target Language Selection Modal */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black text-white">Switch Target Language</h3>
              </div>
              <button
                onClick={() => setLangModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Each language maintains its own independent progression, quests, and levels. Switching will
              never erase or corrupt your progress.
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.id === user.currentLanguage;
                const rec = user.languageProgress?.[lang.id];
                const completed = rec?.completedLessonIds?.length || 0;

                return (
                  <button
                    key={lang.id}
                    onClick={() => {
                      selectLanguage(lang.id);
                      setLangModalOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white'
                        : 'bg-slate-800/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{lang.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({lang.nativeName})</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Level {rec?.currentLevel || 1} • {completed} Quests Done
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
