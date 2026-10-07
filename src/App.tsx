/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/ToastContainer';
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { PracticeView } from './views/PracticeView';
import { LeaderboardView } from './views/LeaderboardView';
import { ProfileView } from './views/ProfileView';
import { LanguageSelectionView } from './views/LanguageSelectionView';
import { LessonEngine } from './views/LessonEngine';

const MainContent: React.FC = () => {
  const { currentView, activeLesson } = useApp();

  // If user is currently in a lesson session, render the distraction-free lesson engine
  if (activeLesson) {
    return <LessonEngine lesson={activeLesson} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <LandingPage />}
        {currentView === 'learn' && <DashboardView />}
        {currentView === 'practice' && <PracticeView />}
        {currentView === 'leaderboard' && <LeaderboardView />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'languages' && <LanguageSelectionView />}
      </main>

      <MobileNav />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
