import React from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';
import { Trophy, Flame, Zap, Shield, Crown, Sparkles, Clock } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboardUsers, user } = useApp();

  const topThree = leaderboardUsers.slice(0, 3);
  const currentUserRank = leaderboardUsers.find((u) => u.isCurrentUser)?.rank || 4;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 pb-28 selection:bg-purple-600 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-md mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-purple-400" />
            Diamond League
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Weekly Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Week resets every Sunday at midnight. Top 3 earn Champion rewards!</span>
          </p>
        </div>

        {/* Podium Section (Top 3) */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="text-center mb-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Podium Contenders
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-lg mx-auto pt-4 pb-2">
            {/* Rank 2 (Left) */}
            {topThree[1] && (
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl sm:text-4xl mb-1">{topThree[1].avatar}</div>
                <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 font-black text-xs flex items-center justify-center mb-2 shadow-sm border border-slate-600">
                  2
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-200 truncate max-w-full">
                  {topThree[1].name}
                </div>
                <div className="text-[11px] font-bold text-purple-400 tabular-nums">
                  {topThree[1].xp} XP
                </div>
                <div className="w-full h-24 bg-slate-800/80 border border-slate-700 rounded-t-2xl mt-3 flex items-center justify-center text-slate-400 font-black text-sm">
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
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center mb-2 shadow-md">
                  1
                </div>
                <div className="font-black text-sm sm:text-base text-white truncate max-w-full">
                  {topThree[0].name}
                </div>
                <div className="text-xs font-black text-amber-400 tabular-nums">
                  {topThree[0].xp} XP
                </div>
                <div className="w-full h-32 bg-amber-500/20 border border-amber-500/40 rounded-t-2xl mt-3 flex items-center justify-center text-amber-300 font-black text-base shadow-sm">
                  Gold
                </div>
              </div>
            )}

            {/* Rank 3 (Right) */}
            {topThree[2] && (
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl sm:text-4xl mb-1">{topThree[2].avatar}</div>
                <div className="w-7 h-7 rounded-full bg-orange-700 text-orange-100 font-black text-xs flex items-center justify-center mb-2 shadow-sm border border-orange-600">
                  3
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-200 truncate max-w-full">
                  {topThree[2].name}
                </div>
                <div className="text-[11px] font-bold text-purple-400 tabular-nums">
                  {topThree[2].xp} XP
                </div>
                <div className="w-full h-18 bg-orange-950/40 border border-orange-500/30 rounded-t-2xl mt-3 flex items-center justify-center text-orange-400 font-black text-xs">
                  Bronze
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs font-bold text-purple-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Promotion Zone: Top 3 advance to the Galactic Division</span>
          </div>
        </div>

        {/* Full Ranking Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Rank & Learner</span>
            <span>Target & XP</span>
          </div>

          <div className="divide-y divide-slate-800">
            {leaderboardUsers.map((learner) => {
              const isCurrent = learner.isCurrentUser;
              const lang = LANGUAGES.find((l) => l.id === learner.language);

              return (
                <div
                  key={learner.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-purple-900/30 font-bold border-l-4 border-purple-500'
                      : 'hover:bg-slate-850'
                  }`}
                >
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-7 text-center font-black text-sm tabular-nums ${
                        learner.rank === 1
                          ? 'text-amber-400'
                          : learner.rank === 2
                          ? 'text-slate-300'
                          : learner.rank === 3
                          ? 'text-orange-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {learner.rank}
                    </div>
                    <div className="text-2xl">{learner.avatar}</div>
                    <div>
                      <div className="text-sm font-extrabold text-white flex items-center gap-2">
                        <span>{learner.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded-md font-black">
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
                    <div className="font-black text-sm text-white tabular-nums">
                      {learner.xp} <span className="text-xs text-purple-400">XP</span>
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
