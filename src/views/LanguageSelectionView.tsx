import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';
import { LanguageCode } from '../types';
import { Check, ArrowRight, Star, Users, Globe2, Sparkles } from 'lucide-react';
import { LandmarkIllustration } from '../components/IllustrationAssets';
import { playSound } from '../utils/audio';

const LANG_LANDMARKS: Record<LanguageCode, 'spain' | 'france' | 'germany' | 'japan' | 'korea' | 'italy'> = {
  es: 'spain',
  fr: 'france',
  de: 'germany',
  ja: 'japan',
  ko: 'korea',
  it: 'italy',
};

export const LanguageSelectionView: React.FC = () => {
  const { user, selectLanguage, setCurrentView } = useApp();
  const [selectedId, setSelectedId] = useState<LanguageCode>(user.currentLanguage);

  const handleCardClick = (id: LanguageCode) => {
    setSelectedId(id);
    if (user.soundEnabled) playSound.tap();
  };

  const handleConfirm = () => {
    selectLanguage(selectedId);
    setCurrentView('learn');
  };

  const activeLang = LANGUAGES.find((l) => l.id === selectedId) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold uppercase tracking-wide mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            Pick Your Destination
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Which language would you like to learn?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Choose a course to get started. You can explore and switch between multiple languages at any time.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedId === lang.id;
            const isCurrent = user.currentLanguage === lang.id;
            const landmarkType = LANG_LANDMARKS[lang.id] || 'spain';

            return (
              <div
                key={lang.id}
                onClick={() => handleCardClick(lang.id)}
                className={`cursor-pointer rounded-3xl p-6 border-2 transition-all relative flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100 scale-[1.02] ring-4 ring-indigo-500/10'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                {/* Active check / Selected badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-300 z-10">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {isCurrent && !isSelected && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full z-10">
                    Active
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-5xl transform group-hover:scale-110 transition-transform inline-block">
                      {lang.flag}
                    </div>
                    <div className="w-16 h-16 opacity-90 group-hover:scale-105 transition-transform">
                      <LandmarkIllustration type={landmarkType} className="w-16 h-16" />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-xl font-black text-slate-900">{lang.name}</h3>
                    <span className="text-xs font-semibold text-slate-400">
                      {lang.nativeName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4">
                    {lang.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Greeting phrase preview */}
                  <div className="bg-slate-50 rounded-xl p-2.5 text-xs">
                    <div className="font-bold text-slate-700">“{lang.greetingPhrase}”</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{lang.greetingMeaning}</div>
                  </div>

                  {/* Difficulty & Learners Count */}
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 flex">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < lang.difficultyStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 ml-1">
                        {lang.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang.learners}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeLang.flag}</span>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Selected: <span className="text-indigo-600 font-extrabold">{activeLang.name}</span>
              </div>
              <div className="text-xs text-slate-500">
                Ready to start Unit 1: Foundations & Real-World Dialogues
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 btn-3d-primary flex items-center justify-center gap-2 group transition-all"
          >
            <span>Continue with {activeLang.name}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
