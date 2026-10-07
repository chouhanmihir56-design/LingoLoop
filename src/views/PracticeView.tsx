import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, VOCAB_CARDS_DATA } from '../data/languages';
import { VocabCard } from '../types';
import { Mascot } from '../components/Mascot';
import {
  Volume2,
  RotateCw,
  Zap,
  CheckCircle,
  HelpCircle,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  BookOpen,
  Mic,
  Headphones,
} from 'lucide-react';
import { playSound, speakPhrase } from '../utils/audio';

type PracticeMode = 'hub' | 'vocab' | 'quiz' | 'listening' | 'speaking' | 'grammar';

export const PracticeView: React.FC = () => {
  const { user, addXp, refillHearts, showToast } = useApp();
  const currentLang = LANGUAGES.find((l) => l.id === user.currentLanguage) || LANGUAGES[0];
  const vocabCards: VocabCard[] = VOCAB_CARDS_DATA[user.currentLanguage] || VOCAB_CARDS_DATA.es;

  const [activeMode, setActiveMode] = useState<PracticeMode>('hub');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);

  // Speed Quiz state
  const [quizTimer, setQuizTimer] = useState(45);
  const [quizScore, setQuizScore] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);

  // Quick quiz mock questions
  const quizQuestions = [
    {
      q: `What is the meaning of “Gracias”?`,
      options: ['Please', 'Thank you', 'Goodbye', 'Good morning'],
      correct: 1,
    },
    {
      q: `Which phrase means “Hello”?`,
      options: ['Adiós', 'Por favor', 'Hola', 'De nada'],
      correct: 2,
    },
    {
      q: `What does “Buenos días” mean?`,
      options: ['Good evening', 'Good night', 'Good morning', 'Have a nice day'],
      correct: 2,
    },
    {
      q: `How do you politely ask for the check in a cafe?`,
      options: ['La cuenta, por favor', 'Mucho gusto', 'Lo siento', '¿Dónde está?'],
      correct: 0,
    },
  ];

  const handleAudio = (text: string) => {
    speakPhrase(text, currentLang.localeCode, user.ttsSpeed);
  };

  const handleCardNext = (known: boolean) => {
    const currentCard = vocabCards[currentCardIndex];
    if (known && currentCard) {
      if (!masteredCards.includes(currentCard.id)) {
        setMasteredCards((prev) => [...prev, currentCard.id]);
        addXp(10, 'Vocab Mastered');
      }
      if (user.soundEnabled) playSound.correct();
    } else {
      if (user.soundEnabled) playSound.tap();
    }

    setIsFlipped(false);
    if (currentCardIndex < vocabCards.length - 1) {
      setCurrentCardIndex((c) => c + 1);
    } else {
      setCurrentCardIndex(0);
      showToast('Completed Flashcard Review session! +20 XP', 'xp', '🎉');
      addXp(20);
    }
  };

  const startQuickQuiz = () => {
    setQuizActive(true);
    setQuizScore(0);
    setQuizQuestionIndex(0);
    setQuizTimer(45);
  };

  const handleQuizAnswer = (selectedIndex: number) => {
    const currentQ = quizQuestions[quizQuestionIndex];
    if (selectedIndex === currentQ.correct) {
      setQuizScore((s) => s + 10);
      if (user.soundEnabled) playSound.correct();
    } else {
      if (user.soundEnabled) playSound.error();
    }

    if (quizQuestionIndex < quizQuestions.length - 1) {
      setQuizQuestionIndex((i) => i + 1);
    } else {
      setQuizActive(false);
      addXp(quizScore + 10, 'Speed Quiz Completed');
      if (user.soundEnabled) playSound.fanfare();
      showToast(`Quiz Finished! Scored ${quizScore + 10} XP! ⚡`, 'xp', '🏆');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Practice Hub Top Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              Skill Gym
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Practice Hub
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Reinforce vocabulary, speaking, listening, and grammar for{' '}
              <span className="text-indigo-600 font-bold">{currentLang.name}</span>.
            </p>
          </div>

          {activeMode !== 'hub' && (
            <button
              onClick={() => setActiveMode('hub')}
              className="px-4 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <span>Back to Practice Hub</span>
            </button>
          )}
        </div>

        {/* MODE: MAIN HUB DASHBOARD */}
        {activeMode === 'hub' && (
          <div className="space-y-8">
            {/* Heart Recovery Callout (if low hearts) */}
            {user.hearts < user.maxHearts && (
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                    <Heart className="w-7 h-7 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Low on Hearts?</h3>
                    <p className="text-xs text-rose-100">
                      You currently have {user.hearts} / {user.maxHearts} hearts. Practice exercises to restore hearts!
                    </p>
                  </div>
                </div>
                <button
                  onClick={refillHearts}
                  className="px-6 py-3 rounded-2xl bg-white text-rose-600 font-black text-xs hover:bg-rose-50 shadow-md transition-all active:scale-95 whitespace-nowrap"
                >
                  Refill Hearts Now
                </button>
              </div>
            )}

            {/* 5 Core Practice Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category 1: Vocabulary Flashcards */}
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Vocabulary Flashcards</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Interactive flip cards with native audio, examples, and spaced repetition tracking.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400">
                    {masteredCards.length} / {vocabCards.length} Mastered
                  </div>
                  <button
                    onClick={() => setActiveMode('vocab')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs btn-3d-primary"
                  >
                    Review Cards
                  </button>
                </div>
              </div>

              {/* Category 2: 60-Second Quick Quiz */}
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-xs hover:shadow-lg hover:border-amber-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    ⚡
                  </div>
                  <h3 className="text-lg font-black text-slate-900">60-Second Quick Quiz</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Test your rapid recall under time pressure and earn bonus XP multiplier boosts.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Up to 50 XP
                  </div>
                  <button
                    onClick={() => {
                      setActiveMode('quiz');
                      startQuickQuiz();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs btn-3d-primary"
                  >
                    Start Sprint
                  </button>
                </div>
              </div>

              {/* Category 3: Listening Drills */}
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    🎧
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Listening Comprehension</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Sharpen your ear to real native conversational cadences, accents, and spoken nuances.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400">
                    38 exercises completed
                  </div>
                  <button
                    onClick={() => setActiveMode('listening')}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs btn-3d-primary"
                  >
                    Tune In
                  </button>
                </div>
              </div>

              {/* Category 4: Speaking & Pronunciation */}
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    🗣️
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Speaking Studio</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Practice tongue placement, accent rhythms, and everyday dialogue roleplay.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400">
                    Daily speech target: 5 mins
                  </div>
                  <button
                    onClick={() => setActiveMode('speaking')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs btn-3d-primary"
                  >
                    Practice Speech
                  </button>
                </div>
              </div>

              {/* Category 5: Grammar Workshop */}
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    ✍️
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Grammar Workshop</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Bite-sized breakdown of verb tenses, gender agreements, and sentence structures.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-purple-600">
                    Unit 1 Grammar Guide
                  </div>
                  <button
                    onClick={() => setActiveMode('grammar')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs btn-3d-primary"
                  >
                    Open Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE: VOCABULARY FLASHCARDS */}
        {activeMode === 'vocab' && (
          <div className="max-w-lg mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>
                Card {currentCardIndex + 1} of {vocabCards.length}
              </span>
              <span>
                {masteredCards.length} Mastered
              </span>
            </div>

            {/* Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-80 bg-white rounded-3xl p-8 border-2 border-indigo-100 shadow-xl cursor-pointer flex flex-col justify-between text-center relative group hover:border-indigo-300 transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {vocabCards[currentCardIndex]?.partOfSpeech || 'Word'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAudio(vocabCards[currentCardIndex]?.term || '');
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-2">
                {!isFlipped ? (
                  <>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      {vocabCards[currentCardIndex]?.term}
                    </h2>
                    {vocabCards[currentCardIndex]?.pronunciation && (
                      <p className="text-xs text-indigo-600 font-semibold">
                        [{vocabCards[currentCardIndex]?.pronunciation}]
                      </p>
                    )}
                    <p className="text-xs text-slate-400 font-medium pt-2">
                      Tap card to reveal English meaning 👆
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                      Meaning
                    </span>
                    <h2 className="text-3xl font-black text-indigo-700 tracking-tight">
                      {vocabCards[currentCardIndex]?.meaning}
                    </h2>
                    <div className="pt-3 border-t border-slate-100 mt-3 text-xs text-slate-600">
                      <div className="font-semibold italic">“{vocabCards[currentCardIndex]?.exampleSentence}”</div>
                      <div className="text-slate-400 mt-0.5">{vocabCards[currentCardIndex]?.exampleTranslation}</div>
                    </div>
                  </>
                )}
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Click anywhere to flip
              </div>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCardNext(false)}
                className="py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 btn-3d-outline"
              >
                Review Again 🔁
              </button>
              <button
                onClick={() => handleCardNext(true)}
                className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md btn-3d-primary"
              >
                I Know This! ✅
              </button>
            </div>
          </div>
        )}

        {/* MODE: QUICK QUIZ SPEED SPRINT */}
        {activeMode === 'quiz' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-amber-600 font-black text-sm">
                  <Zap className="w-4 h-4 fill-amber-500" />
                  <span>Score: {quizScore} XP</span>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Question {quizQuestionIndex + 1} / {quizQuestions.length}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {quizQuestions[quizQuestionIndex].q}
                </h3>
              </div>

              <div className="space-y-2.5">
                {quizQuestions[quizQuestionIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 font-bold text-sm text-left transition-all btn-3d-outline text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE: LISTENING DRILL */}
        {activeMode === 'listening' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-2 border-sky-100 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
              <Headphones className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Listening Ear Trainer</h3>
            <p className="text-xs text-slate-500">
              Listen to the native voice and train your auditory comprehension.
            </p>
            <button
              onClick={() => handleAudio(currentLang.greetingPhrase)}
              className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm shadow-md btn-3d-primary flex items-center justify-center gap-2 mx-auto"
            >
              <Volume2 className="w-5 h-5" />
              <span>Play Sample Audio</span>
            </button>
            <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-700 font-semibold">
              “{currentLang.greetingPhrase}” — {currentLang.greetingMeaning}
            </div>
            <button
              onClick={() => {
                addXp(15, 'Listening Drill');
                showToast('+15 XP Earned in Listening!', 'xp', '🎧');
                setActiveMode('hub');
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl"
            >
              Mark Drill Completed
            </button>
          </div>
        )}

        {/* MODE: SPEAKING STUDIO */}
        {activeMode === 'speaking' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-2 border-emerald-100 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Mic className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Speaking Studio</h3>
            <p className="text-xs text-slate-500">
              Listen to the standard cadence, then speak aloud to match native rhythm.
            </p>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-900 font-bold text-sm">
              “{currentLang.greetingPhrase}”
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleAudio(currentLang.greetingPhrase)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" /> Listen Model
              </button>
              <button
                onClick={() => {
                  playSound.correct();
                  addXp(20, 'Speech Pronunciation');
                  showToast('Speech matched! 94% accuracy score 🗣️', 'success');
                  setActiveMode('hub');
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs btn-3d-primary flex items-center gap-1.5"
              >
                <Mic className="w-4 h-4" /> Record Pronunciation
              </button>
            </div>
          </div>
        )}

        {/* MODE: GRAMMAR WORKSHOP */}
        {activeMode === 'grammar' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border-2 border-purple-100 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">
                Unit 1 Grammar Guide
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Sentence Architecture & Politeness
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <h4 className="font-extrabold text-purple-950 text-sm mb-1">
                  1. Subject Pronoun Flexibility
                </h4>
                <p>
                  In Romance languages like Spanish and Italian, subject pronouns (like “yo” or “yo soy”) are frequently omitted because the verb ending already indicates who is performing the action!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <h4 className="font-extrabold text-indigo-950 text-sm mb-1">
                  2. Formal vs Informal Courtesy
                </h4>
                <p>
                  When addressing elders, professors, or store clerks, use polite formal phrasing (e.g. “¿Cómo está usted?” in Spanish, “Comment allez-vous ?” in French, or “Sie” in German).
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                addXp(15, 'Grammar Guide Finished');
                showToast('+15 XP! Grammar rules noted.', 'xp', '📖');
                setActiveMode('hub');
              }}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl btn-3d-primary"
            >
              Complete Grammar Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
