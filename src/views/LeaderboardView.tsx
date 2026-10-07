import React from 'react';
import { useApp } from '../context/AppContext';
import { TrophyPodiumIllustration } from '../components/IllustrationAssets';
import { LANGUAGES } from '../data/languages';
import { Trophy, Flame, Zap, Shield, Crown, Sparkles, ChevronUp, Clock } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboardUsers, user } = useApp();

  const topThree = leaderboardUsers.slice(0, 3);
  const remaining = leaderboardUsers.slice(3);

  const currentUserRank = leaderboardUsers.find((u) => u.isCurrentUser)?.rank || 4;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-md mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-indigo-600" />
            Diamond League
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Weekly Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Week ends in 2 days, 14 hours. Top 3 earn League Champions badge!</span>
          </p>
        </div>

        {/* Podium Section (Top 3) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-md">
          <div className="text-center mb-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Current Podium Contenders
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-lg mx-auto pt-4 pb-2">
            {/* Rank 2 (Left) */}
            {topThree[1] && (
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl sm:text-4xl mb-1">{topThree[1].avatar}</div>
                <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 font-black text-xs flex items-center justify-center mb-2 shadow-sm">
                  2
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-900 truncate max-w-full">
                  {topThree[1].name}
                </div>
                <div className="text-[11px] font-bold text-indigo-600">
                  {topThree[1].xp} XP
                </div>
                <div className="w-full h-24 bg-slate-100 border-2 border-slate-200 rounded-t-2xl mt-3 flex items-center justify-center text-slate-400 font-black text-sm">
                  Silver
                </div>
              </div>
            )}

            {/* Rank 1 (Center - Highest) */}
            {topThree[0] && (
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl sm:text-5xl mb-1 relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">👑</span>
                  {topThree[0].avatar}
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center mb-2 shadow-md">
                  1
                </div>
                <div className="font-black text-sm sm:text-base text-slate-900 truncate max-w-full">
                  {topThree[0].name}
                </div>
                <div className="text-xs font-black text-amber-600">
                  {topThree[0].xp} XP
                </div>
                <div className="w-full h-32 bg-amber-100/70 border-2 border-amber-300 rounded-t-2xl mt-3 flex items-center justify-center text-amber-700 font-black text-base shadow-sm">
                  Gold
                </div>
              </div>
            )}

            {/* Rank 3 (Right) */}
            {topThree[2] && (
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl sm:text-4xl mb-1">{topThree[2].avatar}</div>
                <div className="w-7 h-7 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center mb-2 shadow-sm">
                  3
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-900 truncate max-w-full">
                  {topThree[2].name}
                </div>
                <div className="text-[11px] font-bold text-indigo-600">
                  {topThree[2].xp} XP
                </div>
                <div className="w-full h-18 bg-amber-50 border-2 border-amber-200 rounded-t-2xl mt-3 flex items-center justify-center text-amber-800 font-black text-xs">
                  Bronze
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs font-bold text-indigo-600 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Promotion Zone: Top 3 advance to Super League</span>
          </div>
        </div>

        {/* Full Ranking Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200/80 shadow-md overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Rank & Learner</span>
            <span>Language & XP</span>
          </div>

          <div className="divide-y divide-slate-100">
            {leaderboardUsers.map((learner) => {
              const isCurrent = learner.isCurrentUser;
              const lang = LANGUAGES.find((l) => l.id === learner.language);

              return (
                <div
                  key={learner.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-indigo-50/90 font-bold border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-7 text-center font-black text-sm ${
                        learner.rank === 1
                          ? 'text-amber-500'
                          : learner.rank === 2
                          ? 'text-slate-400'
                          : learner.rank === 3
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {learner.rank}
                    </div>

                    <div className="text-2xl">{learner.avatar}</div>

                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>{learner.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-md font-black">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {learner.username} • {learner.streak}d streak 🔥
                      </div>
                    </div>
                  </div>

                  {/* Right: Flag & Total XP */}
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-xl" title={lang?.name}>
                      {lang?.flag || '🇪🇸'}
                    </span>
                    <div className="font-black text-sm text-slate-900">
                      {learner.xp} <span className="text-xs text-indigo-600">XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
