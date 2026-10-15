import React, { useEffect, useState } from 'react';
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
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { playSound } from '../utils/audio';

export const LandingPage: React.FC = () => {
  const { setCurrentView, selectLanguage, openArticle, user } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'LingoLoop – Learn a Language Online with Free Courses';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn a language online with LingoLoop. Access free language courses and interactive language practice to build daily speaking fluency in foreign languages.'
      );
    }
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://lingoloop.app/');
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
            How Can You Learn a Language Online Effectively with LingoLoop?
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
            Why Choose Free Language Courses and Interactive Language Practice?
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Engineered with science-backed micro-learning techniques to make language retention natural, playful, and addictive.
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
            <h2 className="text-3xl sm:text-4xl font-black mt-3">How Does LingoLoop Make Language Learning Simple?</h2>
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
            aria-label="Explore All 10 Free Language Learning Guides"
          >
            <span>Explore All 10 Free Language Learning Guides</span>
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
                    <a
                      href={`/blog/${article.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        openArticle(article.slug);
                      }}
                      className="hover:underline"
                      title={article.title}
                    >
                      {article.title}
                    </a>
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
                  <a
                    href={`/blog/${article.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle(article.slug);
                    }}
                    className="group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold hover:underline"
                    title={`Read full guide: ${article.primaryKeyword}`}
                  >
                    Read: {article.primaryKeyword}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keyword Research Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Keyword Research Table
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              SEO target keywords with interactive anchor text hyperlinks and search intent mapping.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Anchor text links active</span>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th scope="col" className="py-4 px-6 whitespace-nowrap">Page</th>
                <th scope="col" className="py-4 px-6 whitespace-nowrap">Main keyword</th>
                <th scope="col" className="py-4 px-6 whitespace-nowrap">2 related keywords</th>
                <th scope="col" className="py-4 px-6 whitespace-nowrap">Intent</th>
                <th scope="col" className="py-4 px-6 whitespace-nowrap">Volume</th>
                <th scope="col" className="py-4 px-6 whitespace-nowrap">Question it answers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold whitespace-nowrap">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-indigo-600 hover:text-indigo-800 underline font-bold inline-flex items-center gap-1"
                    title="Anchor text link to Home page"
                  >
                    Home
                  </a>
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-900 hover:text-indigo-600 underline font-semibold decoration-indigo-300"
                    title="Anchor text: language learning"
                  >
                    language learning
                  </a>
                </td>
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                  <a
                    href="/languages"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('languages');
                    }}
                    className="hover:text-indigo-600 underline decoration-slate-300"
                    title="Anchor text: learn a new language"
                  >
                    learn a new language
                  </a>;{' '}
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 underline decoration-slate-300"
                    title="Anchor text: language learning website"
                  >
                    language learning website
                  </a>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">Know</td>
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">Not verified</td>
                <td className="py-4 px-6 text-slate-700">How can I learn a new language?</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold whitespace-nowrap">
                  <a
                    href="/blog/benefits-of-learning-a-new-language"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('benefits-of-learning-a-new-language');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 underline font-bold inline-flex items-center gap-1"
                    title="Anchor text link to Blog post 1"
                  >
                    Blog post 1
                  </a>
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap">
                  <a
                    href="/blog/benefits-of-learning-a-new-language"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('benefits-of-learning-a-new-language');
                    }}
                    className="text-slate-900 hover:text-indigo-600 underline font-semibold decoration-indigo-300"
                    title="Anchor text: benefits of learning a new language"
                  >
                    benefits of learning a new language
                  </a>
                </td>
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                  <a
                    href="/blog/benefits-of-learning-a-new-language"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('benefits-of-learning-a-new-language');
                    }}
                    className="hover:text-indigo-600 underline decoration-slate-300"
                    title="Anchor text: advantages of learning languages"
                  >
                    advantages of learning languages
                  </a>;{' '}
                  <a
                    href="/blog/benefits-of-learning-a-new-language"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('benefits-of-learning-a-new-language');
                    }}
                    className="hover:text-indigo-600 underline decoration-slate-300"
                    title="Anchor text: benefits of bilingualism"
                  >
                    benefits of bilingualism
                  </a>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">Know</td>
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">Not verified</td>
                <td className="py-4 px-6 text-slate-700">What are the benefits of learning a new language?</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold whitespace-nowrap">
                  <a
                    href="/blog/how-to-learn-a-new-language-faster-proven-tips"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('how-to-learn-a-new-language-faster-proven-tips');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 underline font-bold inline-flex items-center gap-1"
                    title="Anchor text link to Blog post 2"
                  >
                    Blog post 2
                  </a>
                </td>
                <td className="py-4 px-6 font-semibold whitespace-nowrap">
                  <a
                    href="/blog/how-to-learn-a-new-language-faster-proven-tips"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('how-to-learn-a-new-language-faster-proven-tips');
                    }}
                    className="text-slate-900 hover:text-indigo-600 underline font-semibold decoration-indigo-300"
                    title="Anchor text: how to learn a language faster"
                  >
                    how to learn a language faster
                  </a>
                </td>
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                  <a
                    href="/blog/how-to-learn-a-new-language-faster-proven-tips"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('how-to-learn-a-new-language-faster-proven-tips');
                    }}
                    className="hover:text-indigo-600 underline decoration-slate-300"
                    title="Anchor text: effective language learning techniques"
                  >
                    effective language learning techniques
                  </a>;{' '}
                  <a
                    href="/blog/how-to-learn-a-new-language-faster-proven-tips"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('how-to-learn-a-new-language-faster-proven-tips');
                    }}
                    className="hover:text-indigo-600 underline decoration-slate-300"
                    title="Anchor text: language learning tips"
                  >
                    language learning tips
                  </a>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">Know</td>
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">Not verified</td>
                <td className="py-4 px-6 text-slate-700">How can I learn a language faster?</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold whitespace-nowrap">
                  <a
                    href="/blog/how-to-improve-language-skills-exercises"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('how-to-improve-language-skills-exercises');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 underline font-bold inline-flex items-center gap-1"
                    title="Anchor text link to Blog post 3"
                  >
                    Blog post 3
                  </a>
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap">
                  <a
                    href="/blog/how-to-improve-language-skills-exercises"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('how-to-improve-language-skills-exercises');
                    }}
                    className="text-slate-900 hover:text-indigo-600 underline font-semibold decoration-indigo-300"
                    title="Anchor text: improve language skills"
                  >
                    improve language skills
                  </a>
                </td>
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                  <a
                    href="/blog/how-to-improve-language-skills-exercises"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('how-to-improve-language-skills-exercises');
                    }}
                    className="hover:text-indigo-600 underline decoration-slate-300"
                    title="Anchor text: improve speaking skills"
                  >
                    improve speaking skills
                  </a>;{' '}
                  <a
                    href="/blog/how-to-improve-language-skills-exercises"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle('how-to-improve-language-skills-exercises');
                    }}
                    className="hover:text-indigo-600 underline decoration-slate-300"
                    title="Anchor text: language practice exercises"
                  >
                    language practice exercises
                  </a>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">Know</td>
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">Not verified</td>
                <td className="py-4 px-6 text-slate-700">How can I improve my language skills?</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Anchor Text & Alt Text SEO Implementation Directory */}
        <div className="mt-8 bg-slate-50 border-2 border-indigo-100 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>📍</span>
                <span>Anchor Text & Alt Text Implementation Directory</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Detailed location map of all descriptive anchor text hyperlinks and image alt text tags.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full self-start sm:self-auto">
              SEO Best Practices Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Anchor Text Map */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <span>🔗</span> Added Anchor Text Hyperlinks
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
                <li className="pt-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-600">"Home"</span> & <span className="font-bold text-slate-900">"language learning"</span>
                    <span className="block text-[11px] text-slate-400">Links to Homepage (/)</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Table & Nav</span>
                </li>
                <li className="pt-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-600">"learn a new language"</span> & <span className="font-bold text-slate-900">"language learning website"</span>
                    <span className="block text-[11px] text-slate-400">Links to Language selection (/languages) and Home (/)</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Table & Articles</span>
                </li>
                <li className="pt-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-600">"Blog post 1"</span> & <span className="font-bold text-slate-900">"benefits of learning a new language"</span>
                    <span className="block text-[11px] text-slate-400">Links to /blog/benefits-of-learning-a-new-language</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Table & Cards</span>
                </li>
                <li className="pt-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-600">"advantages of learning languages"</span> & <span className="font-bold text-slate-900">"benefits of bilingualism"</span>
                    <span className="block text-[11px] text-slate-400">Links to /blog/benefits-of-learning-a-new-language</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Table & Content</span>
                </li>
                <li className="pt-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-600">"Blog post 2"</span> & <span className="font-bold text-slate-900">"how to learn a language faster"</span>
                    <span className="block text-[11px] text-slate-400">Links to /blog/how-to-learn-a-new-language-faster-proven-tips</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Table & Cards</span>
                </li>
                <li className="pt-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-600">"effective language learning techniques"</span> & <span className="font-bold text-slate-900">"language learning tips"</span>
                    <span className="block text-[11px] text-slate-400">Links to /blog/how-to-learn-a-new-language-faster-proven-tips</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Table & Content</span>
                </li>
                <li className="pt-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-600">"Blog post 3"</span> & <span className="font-bold text-slate-900">"improve language skills"</span>
                    <span className="block text-[11px] text-slate-400">Links to /blog/how-to-improve-language-skills-exercises</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Table & Cards</span>
                </li>
                <li className="pt-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-600">"improve speaking skills"</span> & <span className="font-bold text-slate-900">"language practice exercises"</span>
                    <span className="block text-[11px] text-slate-400">Links to /blog/how-to-improve-language-skills-exercises</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Table & Content</span>
                </li>
              </ul>
            </div>

            {/* Alt Text Map */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <span>🖼️</span> Added Image Alt Text Tags
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
                <li className="pt-2">
                  <span className="font-extrabold text-slate-900 block">Blog 1 Cover Image:</span>
                  <span className="text-slate-600 italic block mt-0.5">"Diverse group of bilingual colleagues collaborating and smiling around a conference table with laptops and language notes"</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">File: /blog/benefits-of-learning-a-new-language</span>
                </li>
                <li className="pt-2">
                  <span className="font-extrabold text-slate-900 block">Blog 2 Cover Image:</span>
                  <span className="text-slate-600 italic block mt-0.5">"Focused student practicing accelerated language learning techniques with colorful flashcards and interactive tablet"</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">File: /blog/how-to-learn-a-new-language-faster-proven-tips</span>
                </li>
                <li className="pt-2">
                  <span className="font-extrabold text-slate-900 block">Blog 3 Cover Image:</span>
                  <span className="text-slate-600 italic block mt-0.5">"Enthusiastic language learner wearing headphones practicing speech drills and pronunciation aloud in a bright study space"</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">File: /blog/how-to-improve-language-skills-exercises</span>
                </li>
                <li className="pt-2">
                  <span className="font-extrabold text-slate-900 block">Mascot & Flag Assets:</span>
                  <span className="text-slate-600 italic block mt-0.5">"Loopi the LingoLoop mascot owl - friendly guide for language learning" + Spanish, French, Italian, Japanese flag aria labels</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Components: Mascot.tsx, Navbar.tsx, LandingPage.tsx</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage Question-and-Answer FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 bg-indigo-50 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Can You Learn a Language Online with LingoLoop?
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-2">
            Answers to common questions about free language courses, daily practice, and reaching conversational fluency.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How can I start learning a foreign language online through free, interactive daily practice?',
              a: 'You can begin learning immediately on LingoLoop without credit cards or complex sign-ups. Choose from Spanish, French, German, Japanese, Korean, or Italian, and complete bite-sized 3-minute lessons combining interactive speech pronunciation, translation builders, and spaced repetition.',
            },
            {
              q: 'Are free language courses sufficient to achieve conversational fluency?',
              a: 'Yes, when free language courses emphasize active recall and consistent interactive language practice. LingoLoop focuses on the top high-frequency words, ear-training drills, and daily streaks so beginners build real-world speaking confidence faster.',
            },
            {
              q: 'How does LingoLoop help learners stay consistent every day?',
              a: 'LingoLoop combines habit stacking with daily streak counters, celebratory milestone chests, voice pronunciation feedback, and Diamond League challenges to transform study sessions into an enjoyable daily routine.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                aria-expanded={openFaqIndex === index}
              >
                <span className="text-base sm:text-lg">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    openFaqIndex === index ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {openFaqIndex === index && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
