import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';
import {
  Flame,
  Zap,
  Trophy,
  CheckCircle2,
  Calendar,
  Settings,
  Edit2,
  Save,
  Volume2,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import { LandmarkIllustration } from '../components/IllustrationAssets';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, achievements, resetProgress, setCurrentView } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [bioInput, setBioInput] = useState(user.bio);
  const [avatarInput, setAvatarInput] = useState(user.avatar);
  const [goalInput, setGoalInput] = useState(user.dailyGoal);

  const currentLang = LANGUAGES.find((l) => l.id === user.currentLanguage) || LANGUAGES[0];

  const avatarChoices = ['🦊', '🦉', '🐱', '🚀', '🧑‍🎓', '🦁', '🐼', '🤖'];

  const handleSaveProfile = () => {
    updateProfile({
      name: nameInput.trim() || 'Learner',
      username: usernameInput.startsWith('@') ? usernameInput : `@${usernameInput}`,
      bio: bioInput.trim(),
      avatar: avatarInput,
      dailyGoal: goalInput,
    });
    setIsEditing(false);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-md relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-5xl shadow-md">
                  {user.avatar}
                </div>
              </div>

              {/* Names & Current Language */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-sm font-semibold text-slate-400">{user.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg">{currentLang.flag}</span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Learning {currentLang.name}
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Level {user.currentLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit / Save Button */}
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md btn-3d-primary flex items-center gap-2 self-start sm:self-center"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Bio or Edit Form */}
          {!isEditing ? (
            <div className="pt-4 text-xs sm:text-sm text-slate-600 font-medium">
              <p>“{user.bio}”</p>
            </div>
          ) : (
            <div className="pt-6 space-y-4 bg-slate-50/60 p-4 rounded-2xl mt-4 border border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Edit Information
              </h4>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Choose Avatar:
                </label>
                <div className="flex gap-2 flex-wrap">
                  {avatarChoices.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatarInput(av)}
                      className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center border-2 transition-all ${
                        avatarInput === av
                          ? 'border-indigo-600 bg-indigo-50 scale-110 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Username</label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bio</label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Daily XP Goal Target:
                </label>
                <div className="flex gap-2">
                  {[10, 20, 30, 50].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setGoalInput(goal)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                        goalInput === goal
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {goal} XP / day
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-xs text-center">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2 fill-orange-400" />
            <div className="text-2xl font-black text-slate-900">{user.streak}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Day Streak
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-xs text-center">
            <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2 fill-amber-400" />
            <div className="text-2xl font-black text-slate-900">{user.totalXp}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total XP
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-xs text-center">
            <Trophy className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">
              {user.completedLessonIds.length}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Lessons Done
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-xs text-center">
            <Award className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">
              {unlockedCount} / {achievements.length}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Badges
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Weekly Learning Activity</h3>
              <p className="text-xs text-slate-500 font-medium">Daily XP earned this week</p>
            </div>
            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
              Target: {user.dailyGoal} XP/day
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-6">
            {user.stats.weeklyActivity.map((day) => {
              const maxXP = 60;
              const heightPercent = Math.min(100, Math.round((day.xp / maxXP) * 100));

              return (
                <div key={day.day} className="flex flex-col items-center h-full justify-end">
                  <div className="text-[10px] font-bold text-slate-400 mb-1">{day.xp}</div>
                  <div className="w-full bg-slate-100 rounded-t-xl h-28 flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        day.targetReached
                          ? 'bg-gradient-to-t from-indigo-600 to-purple-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-2">{day.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Showcase Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Your Achievements</h3>
              <p className="text-xs text-slate-500 font-medium">
                {unlockedCount} unlocked of {achievements.length} available
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl">
              🏆 Badges Collection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => {
              const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-4 transition-all ${
                    ach.unlocked
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-slate-200 bg-slate-50/50 opacity-70'
                  }`}
                >
                  <div className="text-4xl p-2 rounded-2xl bg-white shadow-2xs border border-slate-100 flex-shrink-0">
                    {ach.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-black text-sm text-slate-900 truncate">{ach.title}</h4>
                      {ach.unlocked && (
                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{ach.description}</p>

                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            ach.unlocked ? 'bg-amber-500' : 'bg-slate-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings & Reset Progress Area */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Preferences & Data</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="text-xs font-bold text-slate-800">Reset Learning Progress</div>
              <div className="text-[11px] text-slate-400">
                Clear completed lessons and reset stats back to beginner level.
              </div>
            </div>
            <button
              onClick={resetProgress}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
