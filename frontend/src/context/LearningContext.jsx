import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchLastSession, fetchUserHistory, fetchSessionById } from '../services/api';

const LearningContext = createContext();

export const useLearning = () => useContext(LearningContext);

export const LearningProvider = ({ children, user }) => {
  const [currentSession, setCurrentSession] = useState({
    topic: '',
    confidence: 0,
    goal: '',
    content: null,
    attemptId: null,
  });

  const [history, setHistory] = useState([]); // NEW: Store history

  const [userStats, setUserStats] = useState({
    streak: 5,
    points: 2450,
    topicsCompleted: 8,
    hoursLearned: 12.5,
    lastSession: 'Just now',
    progress: 0,
  });

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'DSA Starter', desc: 'Started your first Data Structures topic', unlocked: true, date: '2023-10-01' },
    { id: 2, title: 'System Design Rookie', desc: 'Completed intro to Scalability', unlocked: true, date: '2023-10-05' },
    { id: 3, title: 'CS Fundamentals', desc: '3 Core Subjects Visited', unlocked: false },
    { id: 4, title: 'Interview Ready', desc: '7 Day Streak', unlocked: false },
  ]);

  const [savedResources, setSavedResources] = useState([]);

  // Load session AND history when user logs in
  useEffect(() => {
    const loadUserData = async () => {
      if (user && user.id) {
        try {
          // 1. Restore Last Session
          if (!currentSession.topic) {
            const sessionRes = await fetchLastSession(user.id);
            if (sessionRes.data.success && sessionRes.data.session) {
              setCurrentSession(sessionRes.data.session);
            }
          }

          // 2. Fetch History
          const historyRes = await fetchUserHistory(user.id);
          if (historyRes.data.success) {
            setHistory(historyRes.data.history);
          }

        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      }
    };

    loadUserData();
  }, [user]);

  const startSession = (data, content, attemptId) => {
    setCurrentSession({
      ...data,
      content,
      attemptId
    });
    // Refresh history immediately after starting new session
    if (user?.id) {
      fetchUserHistory(user.id).then(res => {
        if (res.data.success) setHistory(res.data.history);
      });
    }
  };

  // NEW: Function to resume an old session from history
  const resumeSession = async (attempt) => {
    try {
      // Fetch full details including chat history
      const res = await fetchSessionById(attempt._id);
      if (res.data.success) {
        setCurrentSession(res.data.session);
      }
    } catch (error) {
      console.error("Failed to resume session:", error);
      // Fallback to basic data if fetch fails (won't have chat history)
      setCurrentSession({
        topic: attempt.topic,
        confidence: attempt.confidenceLevel,
        goal: attempt.learningGoal,
        content: {
          explanation: attempt.explanation,
          example: attempt.example,
          quiz: attempt.quiz
        },
        attemptId: attempt._id,
        chatHistory: [] 
      });
    }
  };

  const updateStats = (newPoints) => {
    setUserStats(prev => ({
      ...prev,
      points: prev.points + newPoints
    }));
  };

  const saveResource = (resource) => {
    if (!savedResources.find(r => r.id === resource.id)) {
      setSavedResources([...savedResources, resource]);
    }
  };

  return (
    <LearningContext.Provider value={{ 
      currentSession, 
      userStats, 
      achievements,
      savedResources,
      history, // Export history
      startSession, 
      resumeSession, // Export resume function
      updateStats,
      saveResource
    }}>
      {children}
    </LearningContext.Provider>
  );
};
