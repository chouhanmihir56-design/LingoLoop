import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';
import { Mascot } from '../components/Mascot';
import { BLOG_ARTICLES } from '../data/articles';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Brain,
  Target,
  Trophy,
  CheckCircle2,
  Users,
  Compass,
  Play,
  Heart,
  Zap,
  BookOpen,
  Clock,
} from 'lucide-react';
import { playSound } from '../utils/audio';

export const LandingPage: React.FC = () => {
  const { setCurrentView, selectLanguage, openArticle, user } = useApp();

  useEffect(() => {
    document.title = 'LingoLoop – Learn a Language Online with Free Language Courses';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn a language online with LingoLoop. Access free language courses and interactive language practice across Spanish, French, German, Japanese, Korean, and Italian.'
      );
    }
  }, []);

  const handleStartLearning = () => {
    if (user.soundEnabled) playSound.tap();
    setCurrentView('learn');
  };

  const handleExploreLanguages = () => {
    if (user.soundEnabled) playSound.tap();
    setCurrentView('languages');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Background decorative ambient orbs */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-300/25 via-purple-300/20 to-pink-200/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Pill badge with Main Keyword and Related Keyword */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-xs font-bold text-indigo-700">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Learn a Language Online</span>
                <span className="text-slate-300">•</span>
                <span className="text-indigo-600/90">Free Language Courses</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Learn a Language.{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Make It Yours.
                </span>
              </h1>

              {/* Subheading with Interactive Language Practice */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Build real-world fluency through free language courses and daily interactive language practice across Spanish, French, German, Japanese, Korean, and Italian.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={handleStartLearning}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg shadow-indigo-500/25 btn-3d-primary flex items-center justify-center gap-3 group transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleExploreLanguages}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border-2 border-slate-200 btn-3d-outline flex items-center justify-center gap-2.5 transition-all"
                >
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <span>Explore Languages</span>
                </button>
              </div>

              {/* Trust & Social proof badge */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <span className="inline-block w-6 h-6 rounded-full bg-amber-400 text-center leading-6 text-[10px]">🇪🇸</span>
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-center leading-6 text-[10px]">🇫🇷</span>
                    <span className="inline-block w-6 h-6 rounded-full bg-emerald-500 text-center leading-6 text-[10px]">🇮🇹</span>
                    <span className="inline-block w-6 h-6 rounded-full bg-rose-500 text-center leading-6 text-[10px]">🇯🇵</span>
                  </div>
                  <span>6 Global Languages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>Interactive streak mechanics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Bite-sized 3-minute lessons</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mascot Stage */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative floating card 1: Streak */}
                <div className="absolute -top-4 -left-2 sm:-left-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3 z-20 animate-float" style={{ animationDelay: '0.4s' }}>
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <Flame className="w-6 h-6 fill-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400">Daily Streak</div>
                    <div className="text-sm font-black text-slate-900">5 Days Strong! 🔥</div>
                  </div>
                </div>

                {/* Decorative floating card 2: XP */}
                <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-indigo-100 flex items-center gap-3 z-20 animate-float" style={{ animationDelay: '1.2s' }}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Zap className="w-6 h-6 fill-indigo-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400">Lesson Reward</div>
                    <div className="text-sm font-black text-indigo-700">+25 XP Earned! ⚡</div>
                  </div>
                </div>

                {/* Mascot Card */}
                <div className="relative bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-white rounded-3xl p-8 border-2 border-indigo-100/80 shadow-2xl flex flex-col items-center text-center">
                  <Mascot
                    size="xl"
                    expression="happy"
                    speechBubble="¡Hola! Ready to practice today?"
                    className="mb-4"
                  />
                  <div className="mt-2 text-center">
                    <h3 className="font-black text-xl text-slate-900">Meet Loopi</h3>
                    <p className="text-xs text-slate-500 font-medium">Your cheerful language companion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Languages Carousel / Quick Pick Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pick Your Next Language
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Switch anytime. Your progress in each language is automatically tracked.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.id === user.currentLanguage;
            return (
              <button
                key={lang.id}
                onClick={() => selectLanguage(lang.id)}
                className={`p-4 rounded-2xl border-2 text-center transition-all group relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-2.5 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white tracking-wider">
                    Current
                  </span>
                )}
                <div className="text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform">
                  {lang.flag}
                </div>
                <div className="font-extrabold text-slate-900 text-base">{lang.name}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">{lang.learners}</div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-600">
                  <span>Start</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4 Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 bg-indigo-50 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Built for Real Engagement
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Learners Love LingoLoop
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Engineered with science-backed micro-learning techniques to make language retention natural and addictive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: 🎯 Personalized Learning */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                🎯
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Personalized Learning
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Lessons adapt dynamically to your pace, identifying weak vocabulary and serving targeted review challenges.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600">
              <span>Adaptive Curriculum</span>
            </div>
          </div>

          {/* Card 2: 🔥 Daily Streaks */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                🔥
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Daily Streaks
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Keep the habit alive! Stay accountable with daily streak counters, streak freezes, and celebratory milestones.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-orange-600">
              <span>Habit Formation</span>
            </div>
          </div>

          {/* Card 3: 🧠 Smart Practice */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                🧠
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Smart Practice
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Drill through vocabulary flashcards, audio listening, speech pronunciation, and 60-second speed quizzes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-purple-600">
              <span>Multi-Sensory Skills</span>
            </div>
          </div>

          {/* Card 4: 🏆 Achievements */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                🏆
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Achievements & Ranks
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Earn sparkling badges, unlock secret milestone chests, level up, and climb the weekly Diamond League.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-amber-600">
              <span>Rewarding Gamification</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-indigo-400 font-extrabold uppercase text-xs tracking-widest bg-indigo-900/60 px-3.5 py-1.5 rounded-full border border-indigo-700/50">
              Simple, Proven Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">How It Works</h2>
            <p className="text-indigo-200 text-sm sm:text-base mt-2">
              Start in seconds. No complicated textbooks or dry grammar drills required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xs relative group hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-xl flex items-center justify-center border border-indigo-400/30 mb-6">
                1
              </div>
              <h3 className="text-xl font-black text-white mb-2">Choose a Language</h3>
              <p className="text-sm text-indigo-200/80 leading-relaxed">
                Select from Spanish, French, German, Japanese, Korean, or Italian and set your custom daily goal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xs relative group hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 font-black text-xl flex items-center justify-center border border-purple-400/30 mb-6">
                2
              </div>
              <h3 className="text-xl font-black text-white mb-2">Complete Short Lessons</h3>
              <p className="text-sm text-indigo-200/80 leading-relaxed">
                Interact with rich sentence builders, voice pronunciation, word pairs, and fill-in-the-blanks in 3 minutes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xs relative group hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 font-black text-xl flex items-center justify-center border border-pink-400/30 mb-6">
                3
              </div>
              <h3 className="text-xl font-black text-white mb-2">Practice & Build Your Streak</h3>
              <p className="text-sm text-indigo-200/80 leading-relaxed">
                Revisit flashcards, earn XP, protect your hearts, and watch your conversational confidence soar.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={handleStartLearning}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold rounded-2xl shadow-lg shadow-purple-900/50 hover:scale-105 transition-all text-base inline-flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Language Learning Blog Guides Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 bg-indigo-50 px-3 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              Expert Language Insights
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Guides & Study Science
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Read in-depth roadmaps on pronunciation, spaced repetition, grammar hacks, and travel confidence.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('blog')}
            className="px-5 py-2.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-300 font-bold text-xs text-slate-800 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-2xs group"
          >
            <span>Explore All 10 Articles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_ARTICLES.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => openArticle(article.slug)}
              className="cursor-pointer bg-white rounded-3xl border-2 border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={article.coverImage}
                    alt={article.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                    {article.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTimeMinutes} min
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    {article.publishedDate}
                  </span>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                    /blog/{article.slug.slice(0, 18)}...
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Guide
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
