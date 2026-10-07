import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { playSound, speakPhrase } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LessonEngineProps {
  lesson: LessonNode;
}

export const LessonEngine: React.FC<LessonEngineProps> = ({ lesson }) => {
  const { user, exitLesson, finishLesson, loseHeart, refillHearts, showToast } = useApp();

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
  }, [currentIndex, currentQ]);

  // Handle Match Pairs matching logic
  useEffect(() => {
    if (!currentQ || currentQ.type !== 'match_pairs') return;
    if (selectedLeft && selectedRight) {
      const match = currentQ.pairs.find(
        (p) => p.left === selectedLeft && p.right === selectedRight
      );
      if (match) {
        if (user.soundEnabled) playSound.tap();
        setMatchedPairIds((prev) => [...prev, match.id]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        if (user.soundEnabled) playSound.error();
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  }, [selectedLeft, selectedRight, currentQ, user.soundEnabled]);

  // Handle checking match pairs completion
  useEffect(() => {
    if (currentQ && currentQ.type === 'match_pairs') {
      if (matchedPairIds.length === currentQ.pairs.length && currentQ.pairs.length > 0) {
        if (!isAnswerChecked) {
          handleCheckAnswer();
        }
      }
    }
  }, [matchedPairIds]);

  const handleAudioPlay = (text?: string) => {
    const toSpeak = text || currentQ?.phraseAudioText || (currentQ as any)?.speechPhrase || currentQ?.targetPhrase;
    if (toSpeak) {
      speakPhrase(toSpeak, currentLang.localeCode, user.ttsSpeed);
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
    if (currentQ.type === 'multiple_choice' || currentQ.type === 'listen_choose') {
      return selectedOption !== null;
    }
    if (currentQ.type === 'fill_blank') {
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

    if (currentQ.type === 'multiple_choice' || currentQ.type === 'listen_choose') {
      isCorrect = selectedOption === currentQ.correctIndex;
    } else if (currentQ.type === 'fill_blank') {
      const chosenWord = currentQ.options[selectedOption!];
      isCorrect = chosenWord.toLowerCase() === currentQ.correctWord.toLowerCase();
    } else if (currentQ.type === 'translate') {
      const userSentence = constructedWords.join(' ').trim().toLowerCase().replace(/[.,!]/g, '');
      const expectedSentence = currentQ.correctAnswer.trim().toLowerCase().replace(/[.,!]/g, '');
      isCorrect = userSentence === expectedSentence;
    } else if (currentQ.type === 'arrange_words') {
      const userSentence = constructedWords.join(' ').trim();
      const expectedSentence = currentQ.correctSentence.join(' ').trim();
      isCorrect = userSentence.toLowerCase().replace(/[.,!?]/g, '') === expectedSentence.toLowerCase().replace(/[.,!?]/g, '');
    } else if (currentQ.type === 'match_pairs') {
      isCorrect = matchedPairIds.length === currentQ.pairs.length;
    }

    setIsAnswerChecked(true);

    if (isCorrect) {
      setStatus('correct');
      setMascotExpression('celebrate');
      setCorrectAnswersCount((c) => c + 1);
      if (user.soundEnabled) playSound.correct();
    } else {
      setStatus('incorrect');
      setMascotExpression('sad');
      setHeartsLostInSession((h) => h + 1);
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

  const progressPercentage = Math.round(((currentIndex + (isAnswerChecked && status === 'correct' ? 1 : 0)) / questions.length) * 100);

  // Lesson Finished Screen
  if (isLessonCompleted) {
    const accuracy = Math.round((correctAnswersCount / (questions.length || 1)) * 100);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-indigo-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <Mascot size="lg" expression="celebrate" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Lesson Complete!
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Fantástico! 🎉
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              You mastered “{lesson.title}” and strengthened your skills.
            </p>
          </div>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
              <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1 fill-amber-400" />
              <div className="text-lg font-black text-slate-900">+{lesson.xpReward}</div>
              <div className="text-[10px] font-bold text-amber-600 uppercase">XP Gained</div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-center">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1 fill-orange-400" />
              <div className="text-lg font-black text-slate-900">{user.streak} Days</div>
              <div className="text-[10px] font-bold text-orange-600 uppercase">Streak Safe</div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-center">
              <Trophy className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-black text-slate-900">{accuracy}%</div>
              <div className="text-[10px] font-bold text-indigo-600 uppercase">Accuracy</div>
            </div>
          </div>

          {heartsLostInSession === 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <span>🎯 Perfect Lesson! Unlocked Perfect Badge.</span>
            </div>
          )}

          <button
            onClick={exitLesson}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg shadow-indigo-200 btn-3d-primary flex items-center justify-center gap-2 transition-all"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Out of hearts modal
  if (isOutOfHearts) {
    return (
      <div className="min-h-screen bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">You Ran Out of Hearts!</h3>
          <p className="text-xs text-slate-600">
            Don’t worry! Language learning takes practice. You can refill your hearts for free right now or practice in the hub.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                refillHearts();
                setIsOutOfHearts(false);
              }}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl shadow-md btn-3d-outline"
            >
              Refill Full Hearts (Free) ❤️
            </button>
            <button
              onClick={exitLesson}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <header className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 pb-3 flex items-center gap-4">
        <button
          onClick={exitLesson}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          title="Exit lesson"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(5, progressPercentage)}%` }}
          />
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 text-rose-600 font-black text-sm">
          <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
          <span>{user.hearts}</span>
        </div>
      </header>

      {/* Main Interactive Question Body */}
      <main className="max-w-2xl mx-auto w-full px-4 py-4 sm:py-8 flex-1 flex flex-col justify-center">
        {currentQ && (
          <div className="space-y-6">
            {/* Question Instruction */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  {currentQ.instruction}
                </h2>
              </div>
              <Mascot
                size="sm"
                expression={mascotExpression}
                className="hidden sm:inline-flex"
                interactive={false}
              />
            </div>

            {/* Prompt sentence / Audio bubble (if available) */}
            {(currentQ.targetPhrase || (currentQ as any).promptSentence || currentQ.type === 'multiple_choice' || currentQ.type === 'listen_choose') && (
              <div className="flex items-center gap-3 bg-white p-4 sm:p-5 rounded-2xl border-2 border-indigo-100 shadow-sm">
                <button
                  onClick={() => handleAudioPlay()}
                  className="w-12 h-12 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center transition-all flex-shrink-0 group active:scale-95 shadow-2xs"
                  title="Listen to audio"
                >
                  <Volume2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <div className="text-lg sm:text-xl font-extrabold text-slate-800">
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
                  const letter = ['A', 'B', 'C', 'D'][idx];

                  let cardStyle =
                    'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20';
                  if (isSelected && !isAnswerChecked) {
                    cardStyle =
                      'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-900';
                  } else if (isAnswerChecked && idx === currentQ.correctIndex) {
                    cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isAnswerChecked && isSelected && status === 'incorrect') {
                    cardStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => {
                        if (user.soundEnabled) playSound.tap();
                        setSelectedOption(idx);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all flex items-center gap-3.5 ${cardStyle}`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
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
                <div className="min-h-18 p-3 rounded-2xl bg-white border-2 border-dashed border-indigo-200 flex flex-wrap gap-2 items-center">
                  {constructedWords.length === 0 ? (
                    <span className="text-xs font-semibold text-slate-400 italic px-2">
                      Tap words below to build the translation...
                    </span>
                  ) : (
                    constructedWords.map((word, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswerChecked}
                        onClick={() => handleRemoveWord(word, idx)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all animate-in zoom-in-95"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Available Word Bank */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectWord(word, idx)}
                      className="px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-indigo-400 font-bold text-sm text-slate-800 shadow-2xs btn-3d-outline active:scale-95"
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
                {/* Left Column (Target Foreign Words) */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide text-center">
                    {currentLang.name}
                  </p>
                  {currentQ.pairs.map((pair) => {
                    const isMatched = matchedPairIds.includes(pair.id);
                    const isSelected = selectedLeft === pair.left;
                    return (
                      <button
                        key={pair.id}
                        disabled={isMatched || isAnswerChecked}
                        onClick={() => {
                          if (user.soundEnabled) playSound.tap();
                          setSelectedLeft(pair.left);
                        }}
                        className={`w-full p-3.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 cursor-default'
                            : isSelected
                            ? 'bg-indigo-100 border-indigo-600 text-indigo-900 shadow-md ring-2 ring-indigo-400/20'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {pair.left}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column (English Meanings) */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide text-center">
                    English
                  </p>
                  {/* Scramble order of right pairs */}
                  {[...currentQ.pairs].reverse().map((pair) => {
                    const isMatched = matchedPairIds.includes(pair.id);
                    const isSelected = selectedRight === pair.right;
                    return (
                      <button
                        key={pair.id}
                        disabled={isMatched || isAnswerChecked}
                        onClick={() => {
                          if (user.soundEnabled) playSound.tap();
                          setSelectedRight(pair.right);
                        }}
                        className={`w-full p-3.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 cursor-default'
                            : isSelected
                            ? 'bg-indigo-100 border-indigo-600 text-indigo-900 shadow-md ring-2 ring-indigo-400/20'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {pair.right}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TYPE 4: Fill In The Blank */}
            {currentQ.type === 'fill_blank' && (
              <div className="space-y-6 pt-2">
                {/* Sentence with blank */}
                <div className="p-5 rounded-2xl bg-white border-2 border-indigo-100 text-lg sm:text-xl font-bold text-slate-800 flex flex-wrap items-center gap-2">
                  <span>{currentQ.sentenceBefore}</span>
                  <span className="inline-block min-w-24 px-3 py-1 rounded-xl border-b-4 border-indigo-600 bg-indigo-50 text-indigo-800 text-center">
                    {selectedOption !== null ? currentQ.options[selectedOption] : '______'}
                  </span>
                  <span>{currentQ.sentenceAfter}</span>
                </div>

                <div className="text-xs text-slate-400 font-semibold">
                  Meaning hint: “{currentQ.translationHint}”
                </div>

                {/* Options Pills */}
                <div className="grid grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button
                        key={idx}
                        disabled={isAnswerChecked}
                        onClick={() => {
                          if (user.soundEnabled) playSound.tap();
                          setSelectedOption(idx);
                        }}
                        className={`p-3.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TYPE 5: Listen & Choose */}
            {currentQ.type === 'listen_choose' && (
              <div className="space-y-6 pt-2">
                <div className="flex flex-col items-center justify-center p-8 bg-indigo-50/50 rounded-3xl border-2 border-indigo-100 text-center">
                  <button
                    onClick={() => handleAudioPlay(currentQ.speechPhrase)}
                    className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-300 active:scale-90 transition-all mb-3 group"
                  >
                    <Volume2 className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Click to hear phrase again
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button
                        key={idx}
                        disabled={isAnswerChecked}
                        onClick={() => {
                          if (user.soundEnabled) playSound.tap();
                          setSelectedOption(idx);
                        }}
                        className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-400/20'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TYPE 6: Arrange Words */}
            {currentQ.type === 'arrange_words' && (
              <div className="space-y-6 pt-2">
                {/* Sentence Slot */}
                <div className="min-h-18 p-3 rounded-2xl bg-white border-2 border-dashed border-indigo-200 flex flex-wrap gap-2 items-center">
                  {constructedWords.length === 0 ? (
                    <span className="text-xs font-semibold text-slate-400 italic px-2">
                      Tap words to arrange the correct sentence order...
                    </span>
                  ) : (
                    constructedWords.map((word, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswerChecked}
                        onClick={() => handleRemoveWord(word, idx)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Available Scrambled Words */}
                <div className="flex flex-wrap gap-2">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectWord(word, idx)}
                      className="px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-indigo-400 font-bold text-sm text-slate-800 shadow-2xs btn-3d-outline active:scale-95"
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

      {/* Bottom Sticky Action & Feedback Drawer */}
      <footer
        className={`border-t p-4 sm:p-6 transition-all ${
          status === 'correct'
            ? 'bg-emerald-50 border-emerald-200'
            : status === 'incorrect'
            ? 'bg-rose-50 border-rose-200'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Feedback Info */}
          {status === 'idle' && (
            <div className="hidden sm:block text-xs font-bold text-slate-400">
              Select or arrange your answer, then click Check.
            </div>
          )}

          {status === 'correct' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-black text-emerald-900 text-base">Brilliant! 🎉</h4>
                <p className="text-xs text-emerald-700 font-medium">
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
                <h4 className="font-black text-rose-900 text-base">Incorrect</h4>
                <p className="text-xs text-rose-700 font-medium">
                  {currentQ?.explanation || 'Keep going! Learning from mistakes builds mastery.'}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!canCheckAnswer()}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base shadow-md transition-all ${
                canCheckAnswer()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 btn-3d-primary'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base text-white shadow-md btn-3d-primary flex items-center justify-center gap-2 ${
                status === 'correct'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
