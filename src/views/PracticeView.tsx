import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, VOCAB_CARDS_DATA } from '../data/languages';
import { VocabCard, LessonQuestion, PracticeTopic } from '../types';
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
  AlertCircle,
  ShieldCheck,
  Compass,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import { playSound, speakPhrase } from '../utils/audio';
import { generatePracticeRound, PRACTICE_TOPICS, validateQuestion } from '../utils/lessonEngine';
import confetti from 'canvas-confetti';

type PracticeMode = 'hub' | 'endless' | 'mistakes' | 'topics' | 'listening' | 'vocab';

export const PracticeView: React.FC = () => {
  const {
    user,
    addXp,
    refillHearts,
    recordMistake,
    resolveMistake,
    recordTopicAttempt,
    incrementEndlessRound,
    showToast,
    setCurrentView,
  } = useApp();

  const currentLang = LANGUAGES.find((l) => l.id === user.currentLanguage) || LANGUAGES[0];
  const vocabCards: VocabCard[] = VOCAB_CARDS_DATA[user.currentLanguage] || VOCAB_CARDS_DATA.es;

  const [activeMode, setActiveMode] = useState<PracticeMode>('hub');

  // ENDLESS STREAM STATE
  const [endlessRoundNumber, setEndlessRoundNumber] = useState(1);
  const [endlessQuestions, setEndlessQuestions] = useState<LessonQuestion[]>([]);
  const [endlessIndex, setEndlessIndex] = useState(0);
  const [endlessSelectedOption, setEndlessSelectedOption] = useState<number | null>(null);
  const [endlessConstructedWords, setEndlessConstructedWords] = useState<string[]>([]);
  const [endlessAvailableWords, setEndlessAvailableWords] = useState<string[]>([]);
  const [endlessStatus, setEndlessStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [endlessIsChecked, setEndlessIsChecked] = useState(false);
  const [endlessScore, setEndlessScore] = useState(0);
  const [endlessRoundDone, setEndlessRoundDone] = useState(false);

  // MISTAKE REVIEW STATE
  const [mistakeQuestions, setMistakeQuestions] = useState<LessonQuestion[]>([]);
  const [mistakeIndex, setMistakeIndex] = useState(0);
  const [mistakeSelectedOption, setMistakeSelectedOption] = useState<number | null>(null);
  const [mistakeStatus, setMistakeStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [mistakeIsChecked, setMistakeIsChecked] = useState(false);
  const [resolvedCountInSession, setResolvedCountInSession] = useState(0);
  const [mistakesSessionDone, setMistakesSessionDone] = useState(false);

  // TOPIC EXPLORER STATE
  const [selectedTopic, setSelectedTopic] = useState<PracticeTopic>('all');

  // FLASHCARDS STATE
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);

  // Unresolved mistakes for current language
  const userUnresolvedMistakes = (user.mistakesHistory || []).filter(
    (m) => !m.resolved && m.language === user.currentLanguage
  );

  // Initialize Endless Round
  const startEndlessSession = (topic: PracticeTopic = 'all') => {
    setSelectedTopic(topic);
    const roundQuestions = generatePracticeRound({
      language: user.currentLanguage,
      topic,
      count: 5,
      recentMistakes: user.mistakesHistory,
      prioritizeMistakes: false,
    });

    setEndlessQuestions(roundQuestions);
    setEndlessIndex(0);
    setEndlessScore(0);
    setEndlessStatus('idle');
    setEndlessIsChecked(false);
    setEndlessSelectedOption(null);
    setEndlessRoundDone(false);
    setActiveMode('endless');
  };

  // Next Round in Endless Stream
  const advanceToNextEndlessRound = () => {
    setEndlessRoundNumber((prev) => prev + 1);
    const roundQuestions = generatePracticeRound({
      language: user.currentLanguage,
      topic: selectedTopic,
      count: 5,
      recentMistakes: user.mistakesHistory,
    });

    setEndlessQuestions(roundQuestions);
    setEndlessIndex(0);
    setEndlessScore(0);
    setEndlessStatus('idle');
    setEndlessIsChecked(false);
    setEndlessSelectedOption(null);
    setEndlessRoundDone(false);
    if (user.soundEnabled) playSound.tap();
  };

  // Setup current endless question state
  const currentEndlessQ = endlessQuestions[endlessIndex];

  useEffect(() => {
    if (!currentEndlessQ) return;
    setEndlessStatus('idle');
    setEndlessIsChecked(false);
    setEndlessSelectedOption(null);

    if (currentEndlessQ.type === 'translate') {
      setEndlessConstructedWords([]);
      setEndlessAvailableWords([...currentEndlessQ.wordBank]);
    } else if (currentEndlessQ.type === 'arrange_words') {
      setEndlessConstructedWords([]);
      setEndlessAvailableWords([...currentEndlessQ.scrambledWords]);
    }

    if (currentEndlessQ.phraseAudioText && user.soundEnabled) {
      speakPhrase(currentEndlessQ.phraseAudioText, currentLang.localeCode, user.ttsSpeed);
    }
  }, [endlessIndex, currentEndlessQ, currentLang.localeCode, user.soundEnabled, user.ttsSpeed]);

  const handleAudio = (text: string) => {
    speakPhrase(text, currentLang.localeCode, user.ttsSpeed);
  };

  // Endless answer checking
  const handleCheckEndless = () => {
    if (!currentEndlessQ || endlessIsChecked) return;

    let isCorrect = false;
    let userAns = '';

    if (currentEndlessQ.type === 'multiple_choice' || currentEndlessQ.type === 'listen_choose') {
      isCorrect = endlessSelectedOption === currentEndlessQ.correctIndex;
      userAns = currentEndlessQ.options[endlessSelectedOption!] || '';
    } else if (currentEndlessQ.type === 'fill_blank') {
      const chosen = currentEndlessQ.options[endlessSelectedOption!];
      isCorrect = chosen?.toLowerCase() === currentEndlessQ.correctWord.toLowerCase();
      userAns = chosen;
    } else if (currentEndlessQ.type === 'translate') {
      userAns = endlessConstructedWords.join(' ');
      const userClean = userAns.trim().toLowerCase().replace(/[.,!]/g, '');
      const expClean = currentEndlessQ.correctAnswer.trim().toLowerCase().replace(/[.,!]/g, '');
      isCorrect = userClean === expClean;
    } else if (currentEndlessQ.type === 'arrange_words') {
      userAns = endlessConstructedWords.join(' ');
      const userClean = userAns.trim().toLowerCase().replace(/[.,!?]/g, '');
      const expClean = currentEndlessQ.correctSentence.join(' ').trim().toLowerCase().replace(/[.,!?]/g, '');
      isCorrect = userClean === expClean;
    } else if (currentEndlessQ.type === 'match_pairs') {
      isCorrect = true;
    }

    setEndlessIsChecked(true);

    if (isCorrect) {
      setEndlessStatus('correct');
      setEndlessScore((s) => s + 1);
      if (user.soundEnabled) playSound.correct();
    } else {
      setEndlessStatus('incorrect');
      recordMistake(currentEndlessQ, userAns);
      if (user.soundEnabled) playSound.error();
    }
  };

  const handleContinueEndless = () => {
    if (endlessIndex < endlessQuestions.length - 1) {
      setEndlessIndex((prev) => prev + 1);
    } else {
      // Completed endless round!
      setEndlessRoundDone(true);
      incrementEndlessRound(25);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  // MISTAKE REVIEW LOGIC
  const startMistakeReview = () => {
    if (userUnresolvedMistakes.length === 0) {
      showToast('No mistakes pending! Great mastery! ✨', 'success', '🎯');
      return;
    }

    const questionsFromMistakes = userUnresolvedMistakes
      .map((m) => m.question)
      .filter((q) => validateQuestion(q));

    setMistakeQuestions(questionsFromMistakes);
    setMistakeIndex(0);
    setMistakeStatus('idle');
    setMistakeIsChecked(false);
    setMistakeSelectedOption(null);
    setResolvedCountInSession(0);
    setMistakesSessionDone(false);
    setActiveMode('mistakes');
  };

  const currentMistakeQ = mistakeQuestions[mistakeIndex];

  const handleCheckMistake = () => {
    if (!currentMistakeQ || mistakeIsChecked) return;

    let isCorrect = false;
    if (currentMistakeQ.type === 'multiple_choice' || currentMistakeQ.type === 'listen_choose') {
      isCorrect = mistakeSelectedOption === currentMistakeQ.correctIndex;
    } else if (currentMistakeQ.type === 'fill_blank') {
      const chosen = currentMistakeQ.options[mistakeSelectedOption!];
      isCorrect = chosen?.toLowerCase() === currentMistakeQ.correctWord.toLowerCase();
    } else {
      isCorrect = true;
    }

    setMistakeIsChecked(true);

    if (isCorrect) {
      setMistakeStatus('correct');
      setResolvedCountInSession((c) => c + 1);
      resolveMistake(currentMistakeQ.id);
      addXp(10, 'Mistake Fixed');
      if (user.soundEnabled) playSound.correct();
    } else {
      setMistakeStatus('incorrect');
      if (user.soundEnabled) playSound.error();
    }
  };

  const handleContinueMistake = () => {
    if (mistakeIndex < mistakeQuestions.length - 1) {
      setMistakeIndex((prev) => prev + 1);
      setMistakeStatus('idle');
      setMistakeIsChecked(false);
      setMistakeSelectedOption(null);
    } else {
      setMistakesSessionDone(true);
      if (user.soundEnabled) playSound.fanfare();
      try {
        confetti({ particleCount: 80, spread: 65, origin: { y: 0.5 } });
      } catch {}
    }
  };

  // Flashcards next/previous
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
      showToast('Completed the vocabulary deck! Reviewing again.', 'info', '🔄');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 selection:bg-purple-600 selection:text-white">
      {/* Top Banner Ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-18 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {activeMode !== 'hub' && (
              <button
                onClick={() => setActiveMode('hub')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Back to Practice Hub"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Zap className="w-5 h-5 fill-purple-400" />
            </div>

            <div>
              <h1 className="text-base font-black text-white flex items-center gap-2">
                <span>Endless Practice & Mastery Gym</span>
                <span className="text-xs text-purple-400 font-bold">({currentLang.name})</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Sharpen grammar, vocabulary, listening, and targeted mistake correction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 tabular-nums">
              <span>Rounds:</span>
              <span className="text-purple-400 font-black">{user.endlessRoundsCompleted || 0}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 tabular-nums">
              <AlertCircle className="w-4 h-4" />
              <span>{userUnresolvedMistakes.length} Mistakes to Fix</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ==================== VIEW 1: PRACTICE HUB ==================== */}
        {activeMode === 'hub' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Featured Endless Banner */}
            <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-lg">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Infinite Adaptive Stream
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Never Stop Learning
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-medium">
                    Continuous sequential practice rounds combining vocabulary, translation, listening, and
                    syntax. Each completed round awards +25 XP and +15 Gems.
                  </p>
                </div>

                <button
                  onClick={() => startEndlessSession('all')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>Start Endless Practice</span>
                </button>
              </div>
            </div>

            {/* Quick Practice Modes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Fix My Mistakes */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Targeted Mistake Review</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                      Transform errors into mastery. Automatically revisits questions you missed in past quests.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 tabular-nums">
                    {userUnresolvedMistakes.length > 0
                      ? `${userUnresolvedMistakes.length} queued for review`
                      : 'All clean! ✨'}
                  </span>
                  <button
                    onClick={startMistakeReview}
                    disabled={userUnresolvedMistakes.length === 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      userUnresolvedMistakes.length > 0
                        ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Fix Mistakes
                  </button>
                </div>
              </div>

              {/* Card 2: Audio & Listening Gym */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Audio & Listening Gym</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                      Tune your ears to native speech speed, vowel cadences, and conversational responses.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">Web Speech TTS</span>
                  <button
                    onClick={() => startEndlessSession('social')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Train Ears
                  </button>
                </div>
              </div>

              {/* Card 3: Vocabulary Flashcard Vault */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Vocabulary Vault</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                      Flip interactive flashcards with native pronunciations, meanings, and example sentences.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 tabular-nums">
                    {vocabCards.length} Flashcards
                  </span>
                  <button
                    onClick={() => setActiveMode('vocab')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Open Vault
                  </button>
                </div>
              </div>
            </div>

            {/* Practice by Topic Section */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Targeted Topic Drills</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Choose a specialized area to generate custom exercise sessions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRACTICE_TOPICS.filter((t) => t.id !== 'all').map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => startEndlessSession(topic.id)}
                    className="p-4 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-left transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">
                        {topic.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {topic.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 2: ENDLESS STREAM MODE ==================== */}
        {activeMode === 'endless' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
            {/* Header Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-400">
                  Round {endlessRoundNumber} • Question {endlessIndex + 1} of {endlessQuestions.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-400 tabular-nums">
                  Round Score: {endlessScore}
                </span>
                <button
                  onClick={() => setActiveMode('hub')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Exit Gym
                </button>
              </div>
            </div>

            {/* If Round is finished */}
            {endlessRoundDone ? (
              <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">Round {endlessRoundNumber} Complete!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    You scored {endlessScore} / {endlessQuestions.length}. Earned +25 XP and +15 Gems!
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={advanceToNextEndlessRound}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
                  >
                    Start Round {endlessRoundNumber + 1} (+25 XP)
                  </button>

                  <button
                    onClick={() => setActiveMode('hub')}
                    className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                  >
                    Back to Practice Hub
                  </button>
                </div>
              </div>
            ) : (
              currentEndlessQ && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  {/* Instruction */}
                  <div>
                    <h3 className="text-xl font-black text-white">{currentEndlessQ.instruction}</h3>
                  </div>

                  {/* Audio / Prompt */}
                  {(currentEndlessQ.targetPhrase || (currentEndlessQ as any).prompt || (currentEndlessQ as any).speechPhrase) && (
                    <div className="flex items-center gap-3 bg-slate-850 p-4 rounded-2xl border border-slate-800">
                      <button
                        onClick={() =>
                          handleAudio(
                            currentEndlessQ.targetPhrase ||
                              (currentEndlessQ as any).speechPhrase ||
                              (currentEndlessQ as any).prompt
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div className="text-base sm:text-lg font-bold text-white">
                        {currentEndlessQ.targetPhrase ||
                          (currentEndlessQ as any).speechPhrase ||
                          (currentEndlessQ as any).prompt}
                      </div>
                    </div>
                  )}

                  {/* Multiple Choice Options */}
                  {(currentEndlessQ.type === 'multiple_choice' ||
                    currentEndlessQ.type === 'listen_choose' ||
                    currentEndlessQ.type === 'fill_blank') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentEndlessQ.options.map((opt, idx) => {
                        const isSelected = endlessSelectedOption === idx;
                        let cardStyle =
                          'border-slate-800 bg-slate-850 text-slate-200 hover:border-slate-700';

                        if (isSelected && !endlessIsChecked) {
                          cardStyle = 'border-purple-500 bg-purple-500/20 text-white';
                        } else if (
                          endlessIsChecked &&
                          idx === (currentEndlessQ as any).correctIndex
                        ) {
                          cardStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                        } else if (endlessIsChecked && isSelected && endlessStatus === 'incorrect') {
                          cardStyle = 'border-rose-500 bg-rose-500/20 text-rose-200 line-through';
                        }

                        return (
                          <button
                            key={idx}
                            disabled={endlessIsChecked}
                            onClick={() => setEndlessSelectedOption(idx)}
                            className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer ${cardStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Translate & Arrange Words */}
                  {(currentEndlessQ.type === 'translate' || currentEndlessQ.type === 'arrange_words') && (
                    <div className="space-y-4">
                      <div className="min-h-16 p-3 rounded-2xl bg-slate-850 border-2 border-dashed border-purple-500/30 flex flex-wrap gap-2 items-center">
                        {endlessConstructedWords.length === 0 ? (
                          <span className="text-xs text-slate-500 italic px-2">Tap words below...</span>
                        ) : (
                          endlessConstructedWords.map((w, idx) => (
                            <button
                              key={idx}
                              disabled={endlessIsChecked}
                              onClick={() => {
                                setEndlessConstructedWords((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                );
                                setEndlessAvailableWords((prev) => [...prev, w]);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                            >
                              {w}
                            </button>
                          ))
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center p-3 rounded-2xl bg-slate-850">
                        {endlessAvailableWords.map((w, idx) => (
                          <button
                            key={idx}
                            disabled={endlessIsChecked}
                            onClick={() => {
                              setEndlessConstructedWords((prev) => [...prev, w]);
                              setEndlessAvailableWords((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs"
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback Drawer */}
                  {endlessIsChecked && (
                    <div
                      className={`p-4 rounded-2xl border ${
                        endlessStatus === 'correct'
                          ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="text-xs font-black">
                        {endlessStatus === 'correct' ? 'Correct! ⚡' : 'Mistake recorded:'}
                      </div>
                      <div className="text-xs mt-0.5">{currentEndlessQ.explanation}</div>
                    </div>
                  )}

                  {/* Bottom Action */}
                  <div className="pt-2">
                    {!endlessIsChecked ? (
                      <button
                        onClick={handleCheckEndless}
                        disabled={
                          endlessSelectedOption === null && endlessConstructedWords.length === 0
                        }
                        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                          endlessSelectedOption !== null || endlessConstructedWords.length > 0
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleContinueEndless}
                        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer"
                      >
                        Continue Round
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ==================== VIEW 3: TARGETED MISTAKE REVIEW ==================== */}
        {activeMode === 'mistakes' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                Fixing Mistake {mistakeIndex + 1} of {mistakeQuestions.length}
              </span>

              <button
                onClick={() => setActiveMode('hub')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Exit Review
              </button>
            </div>

            {mistakesSessionDone ? (
              <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">Mistakes Cleaned Up! ✨</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    You resolved {resolvedCountInSession} mistakes and earned +
                    {resolvedCountInSession * 10} XP and +{resolvedCountInSession * 5} Gems!
                  </p>
                </div>

                <button
                  onClick={() => setActiveMode('hub')}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm cursor-pointer"
                >
                  Back to Practice Hub
                </button>
              </div>
            ) : (
              currentMistakeQ && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                      Targeted Revision
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">{currentMistakeQ.instruction}</h3>
                  </div>

                  {(currentMistakeQ.targetPhrase || (currentMistakeQ as any).prompt) && (
                    <div className="flex items-center gap-3 bg-slate-850 p-4 rounded-2xl border border-slate-800">
                      <button
                        onClick={() =>
                          handleAudio(currentMistakeQ.targetPhrase || (currentMistakeQ as any).prompt)
                        }
                        className="w-10 h-10 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div className="text-base font-bold text-white">
                        {currentMistakeQ.targetPhrase || (currentMistakeQ as any).prompt}
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  {'options' in currentMistakeQ && Array.isArray((currentMistakeQ as any).options) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(currentMistakeQ as any).options.map((opt: string, idx: number) => (
                        <button
                          key={idx}
                          disabled={mistakeIsChecked}
                          onClick={() => setMistakeSelectedOption(idx)}
                          className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer ${
                            mistakeSelectedOption === idx
                              ? 'bg-purple-500/20 border-purple-500 text-white'
                              : 'bg-slate-850 border-slate-800 text-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Feedback */}
                  {mistakeIsChecked && (
                    <div
                      className={`p-4 rounded-2xl border ${
                        mistakeStatus === 'correct'
                          ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="text-xs font-black">
                        {mistakeStatus === 'correct' ? 'Resolved! Great correction.' : 'Explanation:'}
                      </div>
                      <div className="text-xs mt-0.5">{currentMistakeQ.explanation}</div>
                    </div>
                  )}

                  <div className="pt-2">
                    {!mistakeIsChecked ? (
                      <button
                        onClick={handleCheckMistake}
                        disabled={mistakeSelectedOption === null}
                        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                          mistakeSelectedOption !== null
                            ? 'bg-purple-600 hover:bg-purple-500 text-white'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        Verify Correction
                      </button>
                    ) : (
                      <button
                        onClick={handleContinueMistake}
                        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm cursor-pointer"
                      >
                        Next Mistake
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ==================== VIEW 4: FLASHCARD VOCAB VAULT ==================== */}
        {activeMode === 'vocab' && (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400">
                Card {currentCardIndex + 1} of {vocabCards.length}
              </span>
              <button
                onClick={() => setActiveMode('hub')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Exit Deck
              </button>
            </div>

            {/* Flashcard Component */}
            {vocabCards[currentCardIndex] && (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="h-80 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-3xl p-6 flex flex-col justify-between text-center transition-all cursor-pointer select-none shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    {vocabCards[currentCardIndex].partOfSpeech}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAudio(vocabCards[currentCardIndex].term);
                    }}
                    className="p-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-auto space-y-3">
                  {!isFlipped ? (
                    <div>
                      <h3 className="text-3xl font-black text-white">
                        {vocabCards[currentCardIndex].term}
                      </h3>
                      {vocabCards[currentCardIndex].pronunciation && (
                        <p className="text-xs text-slate-400 mt-1">
                          /{vocabCards[currentCardIndex].pronunciation}/
                        </p>
                      )}
                      <p className="text-[11px] text-purple-400/80 mt-4">Tap to flip & see meaning</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-2xl font-black text-emerald-400">
                        {vocabCards[currentCardIndex].meaning}
                      </h4>
                      <p className="text-xs text-slate-300 italic mt-3">
                        “{vocabCards[currentCardIndex].exampleSentence}”
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {vocabCards[currentCardIndex].exampleTranslation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {masteredCards.includes(vocabCards[currentCardIndex].id)
                    ? '⭐ Mastered'
                    : 'Learning in progress'}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCardNext(false)}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                Needs Review
              </button>
              <button
                onClick={() => handleCardNext(true)}
                className="py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
              >
                I Know This! (+10 XP)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
