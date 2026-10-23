import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { LessonNode, LessonQuestion } from '../types';
import { Mascot } from '../components/Mascot';
import { LANGUAGES } from '../data/languages';
import {
  X,
  Heart,
  Volume2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Zap,
  Flame,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { playSound, speakPhrase } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LessonEngineProps {
  lesson: LessonNode;
}

export const LessonEngine: React.FC<LessonEngineProps> = ({ lesson }) => {
  const {
    user,
    exitLesson,
    finishLesson,
    loseHeart,
    refillHearts,
    startLesson,
    setCurrentView,
    recordMistake,
    recordTopicAttempt,
    currentCurriculum,
    activeCompletedLessonIds,
    showToast,
  } = useApp();

  const currentLang = LANGUAGES.find((l) => l.id === user.currentLanguage) || LANGUAGES[0];
  const questions: LessonQuestion[] = lesson.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // For translate & arrange words
  const [constructedWords, setConstructedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  // For match pairs
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Answer status & evaluation
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [heartsLostInSession, setHeartsLostInSession] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [mascotExpression, setMascotExpression] = useState<'happy' | 'thinking' | 'celebrate' | 'sad'>('happy');

  const currentQ = questions[currentIndex];

  // Initialize question state whenever currentIndex changes
  useEffect(() => {
    if (!currentQ) return;
    setStatus('idle');
    setIsAnswerChecked(false);
    setSelectedOption(null);
    setMascotExpression('happy');

    if (currentQ.type === 'translate') {
      setConstructedWords([]);
      setAvailableWords([...currentQ.wordBank]);
    } else if (currentQ.type === 'arrange_words') {
      setConstructedWords([]);
      setAvailableWords([...currentQ.scrambledWords]);
    } else if (currentQ.type === 'match_pairs') {
      setMatchedPairIds([]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }

    // Auto pronounce prompt if available
    if (currentQ.phraseAudioText && user.soundEnabled) {
      speakPhrase(currentQ.phraseAudioText, currentLang.localeCode, user.ttsSpeed);
    }
  }, [currentIndex, currentQ, currentLang.localeCode, user.soundEnabled, user.ttsSpeed]);

  const handleAudioPlay = (textToSpeak?: string) => {
    const text = textToSpeak || currentQ?.phraseAudioText || currentQ?.targetPhrase || (currentQ as any)?.promptSentence;
    if (text) {
      speakPhrase(text, currentLang.localeCode, user.ttsSpeed);
    }
  };

  // Match pairs interaction logic
  const handleLeftSelect = (id: string) => {
    if (isAnswerChecked || matchedPairIds.includes(id)) return;
    if (user.soundEnabled) playSound.tap();
    setSelectedLeft(id);
    if (selectedRight) {
      checkPairMatch(id, selectedRight);
    }
  };

  const handleRightSelect = (id: string) => {
    if (isAnswerChecked || matchedPairIds.includes(id)) return;
    if (user.soundEnabled) playSound.tap();
    setSelectedRight(id);
    if (selectedLeft) {
      checkPairMatch(selectedLeft, id);
    }
  };

  const checkPairMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Match found!
      setMatchedPairIds((prev) => [...prev, leftId]);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (user.soundEnabled) playSound.tap();
    } else {
      // Wrong pair
      if (user.soundEnabled) playSound.error();
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 400);
    }
  };

  const handleSelectWord = (word: string, indexInAvailable: number) => {
    if (isAnswerChecked) return;
    if (user.soundEnabled) playSound.tap();
    setConstructedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, idx) => idx !== indexInAvailable));
  };

  const handleRemoveWord = (word: string, indexInConstructed: number) => {
    if (isAnswerChecked) return;
    if (user.soundEnabled) playSound.tap();
    setConstructedWords((prev) => prev.filter((_, idx) => idx !== indexInConstructed));
    setAvailableWords((prev) => [...prev, word]);
  };

  const canCheckAnswer = (): boolean => {
    if (!currentQ || isAnswerChecked) return false;
    if (currentQ.type === 'multiple_choice' || currentQ.type === 'listen_choose' || currentQ.type === 'fill_blank') {
      return selectedOption !== null;
    }
    if (currentQ.type === 'translate' || currentQ.type === 'arrange_words') {
      return constructedWords.length > 0;
    }
    if (currentQ.type === 'match_pairs') {
      return matchedPairIds.length === currentQ.pairs.length;
    }
    return false;
  };

  const handleCheckAnswer = () => {
    if (!currentQ || isAnswerChecked) return;

    let isCorrect = false;
    let userAnswerText = '';

    if (currentQ.type === 'multiple_choice' || currentQ.type === 'listen_choose') {
      isCorrect = selectedOption === currentQ.correctIndex;
      userAnswerText = currentQ.options[selectedOption!] || '';
    } else if (currentQ.type === 'fill_blank') {
      const chosenWord = currentQ.options[selectedOption!];
      isCorrect = chosenWord.toLowerCase() === currentQ.correctWord.toLowerCase();
      userAnswerText = chosenWord;
    } else if (currentQ.type === 'translate') {
      userAnswerText = constructedWords.join(' ');
      const userSentence = userAnswerText.trim().toLowerCase().replace(/[.,!]/g, '');
      const expectedSentence = currentQ.correctAnswer.trim().toLowerCase().replace(/[.,!]/g, '');
      isCorrect = userSentence === expectedSentence;
    } else if (currentQ.type === 'arrange_words') {
      userAnswerText = constructedWords.join(' ');
      const userSentence = userAnswerText.trim();
      const expectedSentence = currentQ.correctSentence.join(' ').trim();
      isCorrect =
        userSentence.toLowerCase().replace(/[.,!?]/g, '') ===
        expectedSentence.toLowerCase().replace(/[.,!?]/g, '');
    } else if (currentQ.type === 'match_pairs') {
      isCorrect = matchedPairIds.length === currentQ.pairs.length;
      userAnswerText = 'Matched all pairs';
    }

    setIsAnswerChecked(true);

    if (isCorrect) {
      setStatus('correct');
      setMascotExpression('celebrate');
      setCorrectAnswersCount((c) => c + 1);
      recordTopicAttempt(currentQ.stage || 'all', true);
      if (user.soundEnabled) playSound.correct();
    } else {
      setStatus('incorrect');
      setMascotExpression('sad');
      setHeartsLostInSession((h) => h + 1);
      recordMistake(currentQ, userAnswerText);
      recordTopicAttempt(currentQ.stage || 'all', false);
      if (user.soundEnabled) playSound.error();

      const hasHearts = loseHeart();
      if (!hasHearts) {
        setIsOutOfHearts(true);
      }
    }
  };

  const handleContinue = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all questions in the lesson
      setIsLessonCompleted(true);
      const isPerfect = heartsLostInSession === 0;
      if (user.soundEnabled) playSound.fanfare();
      finishLesson(lesson.id, lesson.xpReward, isPerfect);
    }
  };

  // Keyboard shortcut listener: 1-4 for options, Enter for check/continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLessonCompleted || isOutOfHearts || showExitConfirm) return;

      if (e.key === 'Enter') {
        if (!isAnswerChecked && canCheckAnswer()) {
          handleCheckAnswer();
        } else if (isAnswerChecked) {
          handleContinue();
        }
      }

      if (!isAnswerChecked && currentQ && (currentQ.type === 'multiple_choice' || currentQ.type === 'listen_choose' || currentQ.type === 'fill_blank')) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= currentQ.options.length) {
          setSelectedOption(num - 1);
          if (user.soundEnabled) playSound.tap();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerChecked, isLessonCompleted, isOutOfHearts, showExitConfirm, currentQ, selectedOption, constructedWords, matchedPairIds]);

  // Compute next actionable quest from currentCurriculum
  const allQuests = currentCurriculum.flatMap((u) => u.lessons);
  const nextQuest =
    allQuests.find(
      (l) => l.type !== 'chest' && l.id !== lesson.id && !activeCompletedLessonIds.includes(l.id)
    ) || allQuests.find((l) => l.id !== lesson.id) || allQuests[0];

  const handleStartNextQuest = () => {
    if (nextQuest) {
      startLesson(nextQuest);
    } else {
      exitLesson();
    }
  };

  const handleStartEndlessPractice = () => {
    exitLesson();
    setCurrentView('practice');
  };

  const progressPercentage = Math.round(
    ((currentIndex + (isAnswerChecked && status === 'correct' ? 1 : 0)) / (questions.length || 1)) * 100
  );

  // Lesson Finished Screen
  if (isLessonCompleted) {
    const accuracy = Math.round((correctAnswersCount / (questions.length || 1)) * 100);

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-purple-600 selection:text-white">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-purple-500/30 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <Mascot size="lg" expression="celebrate" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Quest Mastered!
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Fantástico! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              You mastered “{lesson.title}” and strengthened your skills.
            </p>
          </div>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-3 text-center">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1 fill-amber-400" />
              <div className="text-lg font-black text-white tabular-nums">+{lesson.xpReward}</div>
              <div className="text-[10px] font-bold text-amber-400 uppercase">XP Gained</div>
            </div>

            <div className="bg-slate-800/80 border border-orange-500/30 rounded-2xl p-3 text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1 fill-orange-400" />
              <div className="text-lg font-black text-white tabular-nums">{user.streak} Days</div>
              <div className="text-[10px] font-bold text-orange-400 uppercase">Streak Safe</div>
            </div>

            <div className="bg-slate-800/80 border border-purple-500/30 rounded-2xl p-3 text-center">
              <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-lg font-black text-white tabular-nums">{accuracy}%</div>
              <div className="text-[10px] font-bold text-purple-300 uppercase">Accuracy</div>
            </div>
          </div>

          {heartsLostInSession === 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
              <span>🎯 Perfect Quest! Unlocked Perfect Accuracy Bonus.</span>
            </div>
          )}

          {/* Action Pathways: NO DEAD ENDS! */}
          <div className="space-y-2.5 pt-2">
            {/* Primary Action: Continue directly to next progressive quest */}
            <button
              onClick={handleStartNextQuest}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Continue to Next Quest</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Secondary Action: Endless Practice */}
            <button
              onClick={handleStartEndlessPractice}
              className="w-full py-3 rounded-2xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-purple-300" />
              <span>Launch Endless Practice Round</span>
            </button>

            {/* Tertiary: Return to Map */}
            <button
              onClick={exitLesson}
              className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Return to Adventure Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Out of hearts modal
  if (isOutOfHearts) {
    return (
      <div className="min-h-screen bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
        <div className="max-w-sm w-full bg-slate-900 rounded-3xl p-6 border border-rose-500/30 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>
          <h3 className="text-2xl font-black text-white">Out of Hearts</h3>
          <p className="text-xs text-slate-300">
            Mistakes are stepping stones to fluency! In LingoLoop, hearts never lock you out permanently.
            Refill them for free right now or practice in the endless gym.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                refillHearts();
                setIsOutOfHearts(false);
              }}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              Refill Full Hearts (Free) ❤️
            </button>
            <button
              onClick={exitLesson}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 font-bold transition-colors cursor-pointer"
            >
              Exit to Adventure Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Top Header Navigation & Progress Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
          {/* Close button with safe exit confirmation */}
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setShowExitConfirm(true);
              } else {
                exitLesson();
              }
            }}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Exit quest"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Animated Segmented Progress Bar */}
          <div className="flex-1 max-w-lg">
            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats Indicators: Hearts & Language */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-rose-400 font-extrabold text-sm tabular-nums">
              <Heart className="w-5 h-5 fill-rose-500" />
              <span>{user.hearts}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs font-bold">
              <span>{currentLang.flag}</span>
              <span>{currentLang.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Interactive Exercise Canvas */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center my-auto space-y-6">
        {currentQ && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header: Instruction & Mascot */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                  Question {currentIndex + 1} of {questions.length} • {lesson.title}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                  {currentQ.instruction}
                </h2>
              </div>
              <Mascot size="sm" expression={mascotExpression} className="hidden sm:inline-flex" interactive={false} />
            </div>

            {/* Prompt sentence / Audio bubble (if available) */}
            {(currentQ.targetPhrase || (currentQ as any).promptSentence || currentQ.type === 'multiple_choice' || currentQ.type === 'listen_choose') && (
              <div className="flex items-center gap-3.5 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm">
                <button
                  onClick={() => handleAudioPlay()}
                  className="w-12 h-12 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 flex items-center justify-center transition-all flex-shrink-0 active:scale-95 border border-purple-500/30 cursor-pointer"
                  title="Listen to audio"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <div className="text-lg sm:text-xl font-extrabold text-white">
                  {currentQ.targetPhrase || (currentQ as any).promptSentence || (currentQ as any).prompt || 'Listen carefully:'}
                </div>
              </div>
            )}

            {/* RENDER QUESTION BY TYPE */}

            {/* TYPE 1: Multiple Choice */}
            {currentQ.type === 'multiple_choice' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const letter = `${idx + 1}`;
                  let cardStyle = 'border-slate-800 bg-slate-900 text-slate-200 hover:border-purple-500/60 hover:bg-slate-800/80';

                  if (isSelected && !isAnswerChecked) {
                    cardStyle = 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/30 text-white';
                  } else if (isAnswerChecked && idx === currentQ.correctIndex) {
                    cardStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold';
                  } else if (isAnswerChecked && isSelected && status === 'incorrect') {
                    cardStyle = 'border-rose-500 bg-rose-500/20 text-rose-200 line-through';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => {
                        if (user.soundEnabled) playSound.tap();
                        setSelectedOption(idx);
                      }}
                      className={`p-4 rounded-2xl border text-left font-bold text-sm sm:text-base transition-all flex items-center gap-3.5 cursor-pointer ${cardStyle}`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 font-extrabold text-xs flex items-center justify-center flex-shrink-0 border border-slate-700">
                        {letter}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TYPE 2: Translate & Word Bank */}
            {currentQ.type === 'translate' && (
              <div className="space-y-6 pt-2">
                {/* Sentence Construction Slot */}
                <div className="min-h-18 p-3.5 rounded-2xl bg-slate-900 border-2 border-dashed border-purple-500/40 flex flex-wrap gap-2 items-center">
                  {constructedWords.length === 0 ? (
                    <span className="text-xs font-semibold text-slate-500 italic px-2">
                      Tap words below to build the translation...
                    </span>
                  ) : (
                    constructedWords.map((word, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswerChecked}
                        onClick={() => handleRemoveWord(word, idx)}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-sm transition-all animate-in zoom-in-95 cursor-pointer"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Available Word Bank */}
                <div className="flex flex-wrap gap-2 justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectWord(word, idx)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TYPE 3: Match Pairs */}
            {currentQ.type === 'match_pairs' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Left Words */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {currentLang.name}
                  </span>
                  {currentQ.pairs.map((p) => {
                    const isMatched = matchedPairIds.includes(p.id);
                    const isSelected = selectedLeft === p.id;
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched || isAnswerChecked}
                        onClick={() => handleLeftSelect(p.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 opacity-60 line-through'
                            : isSelected
                            ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {p.left}
                      </button>
                    );
                  })}
                </div>

                {/* Right Translations */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    English
                  </span>
                  {currentQ.pairs.map((p) => {
                    const isMatched = matchedPairIds.includes(p.id);
                    const isSelected = selectedRight === p.id;
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched || isAnswerChecked}
                        onClick={() => handleRightSelect(p.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 opacity-60 line-through'
                            : isSelected
                            ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {p.right}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TYPE 4: Fill in the Blank */}
            {currentQ.type === 'fill_blank' && (
              <div className="space-y-6 pt-2">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-lg sm:text-xl font-bold text-slate-200 leading-relaxed">
                  <span>{currentQ.sentenceBefore} </span>
                  <span className="inline-block px-4 py-1 rounded-xl bg-purple-500/20 border-b-2 border-purple-400 text-purple-200 font-extrabold min-w-24 text-center">
                    {selectedOption !== null ? currentQ.options[selectedOption] : '______'}
                  </span>
                  <span> {currentQ.sentenceAfter}</span>
                </div>

                <div className="text-xs text-slate-400 italic">
                  Hint: {currentQ.translationHint}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => {
                        if (user.soundEnabled) playSound.tap();
                        setSelectedOption(idx);
                      }}
                      className={`p-3.5 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                        selectedOption === idx
                          ? 'bg-purple-600/30 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TYPE 5: Listen & Choose */}
            {currentQ.type === 'listen_choose' && (
              <div className="space-y-4 pt-2">
                <div className="flex justify-center py-4">
                  <button
                    onClick={() => handleAudioPlay(currentQ.speechPhrase)}
                    className="w-20 h-20 rounded-3xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-transform active:scale-95 cursor-pointer"
                    title="Play speech"
                  >
                    <Volume2 className="w-10 h-10" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => {
                        if (user.soundEnabled) playSound.tap();
                        setSelectedOption(idx);
                      }}
                      className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer ${
                        selectedOption === idx
                          ? 'bg-purple-600/30 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TYPE 6: Arrange Words */}
            {currentQ.type === 'arrange_words' && (
              <div className="space-y-6 pt-2">
                <div className="min-h-18 p-3.5 rounded-2xl bg-slate-900 border-2 border-dashed border-purple-500/40 flex flex-wrap gap-2 items-center">
                  {constructedWords.length === 0 ? (
                    <span className="text-xs font-semibold text-slate-500 italic px-2">
                      Tap tiles below to arrange the correct sentence...
                    </span>
                  ) : (
                    constructedWords.map((word, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswerChecked}
                        onClick={() => handleRemoveWord(word, idx)}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-sm transition-all animate-in zoom-in-95 cursor-pointer"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectWord(word, idx)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Sticky Action & Pedagogical Feedback Drawer */}
      <footer
        className={`border-t p-4 sm:p-6 transition-all ${
          status === 'correct'
            ? 'bg-emerald-950/70 border-emerald-500/30'
            : status === 'incorrect'
            ? 'bg-rose-950/70 border-rose-500/30'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Feedback Info */}
          {status === 'idle' && (
            <div className="text-xs font-bold text-slate-400">
              Select or arrange your answer, then press Check. (or press Enter)
            </div>
          )}

          {status === 'correct' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-black text-emerald-300 text-base">Brilliant! 🎉</h4>
                <p className="text-xs text-emerald-200/90 font-medium">
                  {currentQ?.explanation || 'Great job! +5 XP earned.'}
                </p>
              </div>
            </div>
          )}

          {status === 'incorrect' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-black text-rose-300 text-base">Incorrect</h4>
                <p className="text-xs text-rose-200/90 font-medium max-w-sm">
                  {currentQ?.explanation || 'Mistake logged for smart review. You will master this soon!'}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!canCheckAnswer()}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base shadow-lg transition-all cursor-pointer ${
                canCheckAnswer()
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/50 hover:scale-105 active:scale-95'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base text-slate-950 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                status === 'correct'
                  ? 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-950/40'
                  : 'bg-rose-400 hover:bg-rose-300 shadow-rose-950/40'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </footer>

      {/* Safe Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Pause this Quest?</h3>
            <p className="text-xs text-slate-300">
              You’re making great progress! If you exit now, this session’s uncompleted questions will be
              reset, but all your saved XP and streak remain completely safe.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Keep Learning
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  exitLesson();
                }}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-bold transition-colors cursor-pointer"
              >
                Exit to Adventure Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
