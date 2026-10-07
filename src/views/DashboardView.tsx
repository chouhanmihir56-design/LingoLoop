import React from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, LANGUAGE_CURRICULA } from '../data/languages';
import { Mascot } from '../components/Mascot';
import { LessonNode } from '../types';
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
} from 'lucide-react';
import { playSound } from '../utils/audio';

export const DashboardView: React.FC = () => {
  const {
    user,
    startLesson,
    claimChest,
    setCurrentView,
    achievements,
    refillHearts,
  } = useApp();

  const currentLang = LANGUAGES.find((l) => l.id === user.currentLanguage) || LANGUAGES[0];
  const curriculum = LANGUAGE_CURRICULA[user.currentLanguage] || LANGUAGE_CURRICULA.es;

  // Flatten all lessons in order to calculate overall progress
  const allLessons: LessonNode[] = curriculum.flatMap((u) => u.lessons);
  const completedCount = allLessons.filter(
    (l) => l.type !== 'chest' && user.completedLessonIds.includes(l.id)
  ).length;
  const totalStandardLessons = allLessons.filter((l) => l.type !== 'chest').length || 1;
  const progressPercent = Math.min(100, Math.round((completedCount / totalStandardLessons) * 100));

  // Find next actionable lesson
  const nextLesson =
    allLessons.find((l) => l.type === 'lesson' && !user.completedLessonIds.includes(l.id)) ||
    allLessons[0];

  const handleStartContinue = () => {
    if (user.hearts <= 0) {
      refillHearts();
    }
    if (nextLesson) {
      startLesson(nextLesson);
    }
  };

  const handleNodeClick = (lesson: LessonNode, isLocked: boolean) => {
    if (isLocked) {
      if (user.soundEnabled) playSound.error();
      return;
    }
    if (lesson.type === 'chest') {
      claimChest(lesson.id, lesson.xpReward);
      return;
    }
    if (user.hearts <= 0) {
      refillHearts();
    }
    startLesson(lesson);
  };

  const dailyGoalProgress = Math.min(100, Math.round((user.dailyXp / user.dailyGoal) * 100));

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Top Banner Ribbon */}
      <div className="bg-white border-b border-slate-200/80 sticky top-18 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Greeting & Language */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentLang.flag}</span>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Hey, {user.name}! <span className="inline-block animate-wave">👋</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Learning <span className="font-bold text-indigo-600">{currentLang.name}</span> • Level {user.currentLevel}
              </p>
            </div>
          </div>

          {/* Quick Stats bar */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            {/* Daily Goal */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                🎯
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-700">
                  {user.dailyXp}/{user.dailyGoal} XP
                </span>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-0.5 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${dailyGoalProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 text-orange-600 text-xs font-bold">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{user.streak} Day Streak</span>
            </div>

            {/* Hearts */}
            <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold">
              <Heart className="w-4 h-4 fill-rose-500" />
              <span>{user.hearts} Hearts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Learning Column: Continue Card + Visual Progress Path */}
          <div className="lg:col-span-8 space-y-8">
            {/* Large "Continue Learning" Banner Card */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-md">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-indigo-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unit {curriculum[0]?.number || 1} • Up Next</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {nextLesson?.title || 'Start Next Lesson'}
                  </h2>
                  <p className="text-indigo-100 text-xs sm:text-sm font-medium">
                    {nextLesson?.description || 'Build vocabulary and essential phrases with interactive challenges.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-bold text-indigo-200 pt-2">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-300" /> +{nextLesson?.xpReward || 20} XP
                    </span>
                    <span>•</span>
                    <span>⏱ ~{nextLesson?.estimatedMinutes || 3} mins</span>
                    <span>•</span>
                    <span>Overall Course: {progressPercent}%</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleStartContinue}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-indigo-700 font-black text-base shadow-lg shadow-black/10 btn-3d-outline active:translate-y-1 flex items-center justify-center gap-3 transition-all"
                  >
                    <Play className="w-5 h-5 fill-indigo-700" />
                    <span>Continue Learning</span>
                  </button>
                  <span className="text-[11px] text-indigo-200 font-medium">
                    Press to start lesson
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Learning Path (Duolingo-style gamified interactive path) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Your Learning Path</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Step by step to fluency. Complete lessons to unlock milestones.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl">
                  <span>{progressPercent}% Complete</span>
                </div>
              </div>

              {/* Units & Zigzag Nodes */}
              <div className="space-y-12">
                {curriculum.map((unit) => (
                  <div key={unit.id} className="space-y-6">
                    {/* Unit Header Banner */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-md">
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                          {unit.title}
                        </div>
                        <div className="text-sm font-medium text-slate-300 mt-0.5">
                          {unit.description}
                        </div>
                      </div>
                      <BookOpen className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    </div>

                    {/* Nodes in visual meandering path */}
                    <div className="flex flex-col items-center gap-6 py-4 relative">
                      {unit.lessons.map((lesson, idx) => {
                        const isCompleted = user.completedLessonIds.includes(lesson.id);
                        const isChest = lesson.type === 'chest';
                        // A node is locked if previous standard lesson is not completed
                        const prevLesson = idx > 0 ? unit.lessons[idx - 1] : null;
                        const isLocked = prevLesson ? !user.completedLessonIds.includes(prevLesson.id) : false;
                        const isCurrentActive = !isCompleted && !isLocked;

                        // Zigzag alternating horizontal offsets
                        const offsets = ['translate-x-0', '-translate-x-10', 'translate-x-10', 'translate-x-0'];
                        const offsetClass = offsets[idx % offsets.length];

                        return (
                          <div
                            key={lesson.id}
                            className={`flex flex-col items-center relative transition-transform ${offsetClass}`}
                          >
                            {/* Speech bubble on current active lesson */}
                            {isCurrentActive && (
                              <div className="mb-2 bg-indigo-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-xl shadow-md animate-bounce">
                                START HERE!
                              </div>
                            )}

                            {/* Node Button */}
                            <button
                              onClick={() => handleNodeClick(lesson, isLocked)}
                              disabled={isLocked}
                              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all relative ${
                                isCompleted
                                  ? 'bg-emerald-500 text-white shadow-[0_6px_0_#059669] hover:bg-emerald-400 active:translate-y-1 active:shadow-[0_2px_0_#059669]'
                                  : isCurrentActive
                                  ? 'bg-indigo-600 text-white shadow-[0_6px_0_#4338ca] hover:bg-indigo-500 active:translate-y-1 active:shadow-[0_2px_0_#4338ca] ring-4 ring-indigo-200 pulse-glow scale-110'
                                  : isChest
                                  ? 'bg-amber-400 text-amber-950 shadow-[0_6px_0_#d97706] hover:bg-amber-300'
                                  : 'bg-slate-200 text-slate-400 shadow-[0_6px_0_#cbd5e1] cursor-not-allowed opacity-75'
                              }`}
                              title={
                                isLocked
                                  ? 'Locked - complete prior lessons to unlock'
                                  : isCompleted
                                  ? `${lesson.title} (Completed - tap to review)`
                                  : lesson.title
                              }
                            >
                              {isCompleted ? (
                                <Check className="w-8 h-8 stroke-[3]" />
                              ) : isLocked ? (
                                <Lock className="w-7 h-7 text-slate-400" />
                              ) : isChest ? (
                                <Gift className="w-8 h-8 animate-pulse text-amber-950" />
                              ) : (
                                <Star className="w-8 h-8 fill-white" />
                              )}

                              {/* Completed Stars Indicator */}
                              {isCompleted && (
                                <div className="absolute -bottom-2 flex gap-0.5">
                                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                </div>
                              )}
                            </button>

                            {/* Node Title & Description */}
                            <div className="mt-2 text-center max-w-[160px]">
                              <div className="text-xs font-bold text-slate-800 line-clamp-1">
                                {lesson.title}
                              </div>
                              <div className="text-[10px] text-slate-500 font-semibold">
                                +{lesson.xpReward} XP
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Widgets: Daily Challenge, Mascot, Recommended Practice, Achievements */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mascot Friendly Widget */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-100 flex items-center gap-4">
              <Mascot
                size="sm"
                expression="happy"
                className="flex-shrink-0"
              />
              <div>
                <h4 className="text-sm font-black text-slate-900">“¡Buen trabajo, Mihir!”</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  You’ve maintained a 5-day streak. Complete 1 more lesson to reach today’s goal!
                </p>
              </div>
            </div>

            {/* Daily Challenge Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    🔥
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Daily Challenge</h4>
                    <p className="text-[11px] text-slate-500">Resets in 6 hours</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  +30 Gems
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Earn 30 XP today</span>
                  <span>{user.dailyXp} / 30 XP</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (user.dailyXp / 30) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {user.dailyXp >= 30
                    ? '🎉 Challenge completed! Bonus gems secured.'
                    : `Earn ${Math.max(0, 30 - user.dailyXp)} more XP to finish.`}
                </p>
              </div>
            </div>

            {/* Recommended Practice Shortcuts */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-black text-slate-900">Recommended Practice</h4>
                <button
                  onClick={() => setCurrentView('practice')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                >
                  <span>All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setCurrentView('practice')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                        Vocabulary Flashcards
                      </div>
                      <div className="text-[11px] text-slate-400">16 words mastered</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => setCurrentView('practice')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                        60-Second Speed Quiz
                      </div>
                      <div className="text-[11px] text-slate-400">Earn up to 40 XP</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => setCurrentView('practice')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎧</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                        Listening Drills
                      </div>
                      <div className="text-[11px] text-slate-400">Sharpen your ear</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Achievements Snapshot */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-slate-900">Recent Achievements</h4>
                <button
                  onClick={() => setCurrentView('profile')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
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
                        ? 'bg-amber-50/60 border-amber-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                    title={`${ach.title}: ${ach.description}`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <span className="text-[10px] font-bold text-slate-700 mt-1 truncate max-w-full">
                      {ach.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
