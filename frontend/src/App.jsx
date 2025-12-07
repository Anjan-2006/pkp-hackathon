import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LearningProvider } from './context/LearningContext';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { LearnPage } from './pages/LearnPage';
import { QuizModule } from './pages/QuizModule';
import { Resources } from './pages/Resources';
import { RoadmapProgress } from './pages/RoadmapProgress';
import { AutomationPage } from './pages/AutomationPage';
import { TimetableGenerator } from './pages/TimetableGenerator'; // New Import
import { Analytics } from './pages/Analytics';
import { checkAuth, logoutUser } from './services/api';
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check if user is already logged in via session
  useEffect(() => {
    checkAuth()
      .then(res => setUser(res.data.user))
      .catch(() => console.log('Not logged in'))
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <LearningProvider user={user}>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/onboarding" />} />

            {/* Protected Routes */}
            {user ? (
              <>
                <Route path="/onboarding" element={<Onboarding userId={user.id} />} />
                <Route element={<MainLayout user={user} onLogout={handleLogout} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/quiz" element={<QuizModule />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/roadmap" element={<RoadmapProgress />} />
                  <Route path="/timetable" element={<TimetableGenerator />} /> {/* New Route */}
                  <Route path="/automation" element={<AutomationPage />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </LearningProvider>
  );
}
