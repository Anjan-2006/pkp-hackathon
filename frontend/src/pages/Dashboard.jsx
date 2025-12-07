import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Clock, Flame, Activity, BarChart, RotateCcw, Calendar } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const Dashboard = () => {
  const { currentSession, userStats, history, resumeSession } = useLearning();
  const navigate = useNavigate();

  const handleResume = async (attempt) => {
    await resumeSession(attempt);
    navigate('/learn');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Future Engineer! 🚀</h1>
          <p className="text-gray-500 mt-1">Your placement preparation journey continues.</p>
        </div>
        <button 
          onClick={() => navigate('/onboarding')}
          className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl font-bold hover:bg-indigo-50 transition flex items-center gap-2"
        >
          <Plus size={18} /> New Subject
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Activity size={18} /> <span className="text-sm font-medium">Current Subject</span>
          </div>
          <p className="font-bold text-lg truncate">{currentSession.topic || "None Selected"}</p>
        </div>
        
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <BarChart size={18} /> <span className="text-sm font-medium">Progress</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="font-bold text-2xl text-indigo-600">{userStats.progress}%</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${userStats.progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock size={18} /> <span className="text-sm font-medium">Last Session</span>
          </div>
          <p className="font-bold text-lg">{userStats.lastSession}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Flame size={18} className="text-orange-500" /> <span className="text-sm font-medium">Streak</span>
          </div>
          <p className="font-bold text-2xl text-orange-500">{userStats.streak} Days</p>
        </div>
      </div>

      {/* Main Active Learning Card */}
      {currentSession.topic ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-3xl border-l-8 border-indigo-500 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue: {currentSession.topic}</h2>
            <p className="text-gray-600 mb-6 max-w-xl">
              You're making great progress. Dive back into the core concepts or take a quick skill check to solidify your knowledge.
            </p>
            <button 
              onClick={() => navigate('/learn')} 
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
            >
              <Play size={20} /> Continue Learning
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4F46E5" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,71.6,32.6C61,43.7,51.1,53.1,39.8,60.6C28.5,68.1,15.8,73.8,2.4,69.6C-11,65.4,-25.1,51.3,-38.6,39.8C-52.1,28.3,-65,19.4,-70.8,6.9C-76.6,-5.6,-75.3,-21.7,-67.1,-35.3C-58.9,-48.9,-43.8,-60,-29.2,-66.9C-14.6,-73.8,0.5,-76.5,15.6,-76.4L44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 glass-card rounded-3xl">
          <p className="text-gray-500 mb-4">No active topic selected.</p>
          <button onClick={() => navigate('/onboarding')} className="text-indigo-600 font-bold hover:underline">Start a new topic</button>
        </div>
      )}

      {/* Previous Sessions History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RotateCcw size={20} /> Previous Sessions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((attempt) => (
              <motion.div 
                key={attempt._id}
                whileHover={{ y: -5 }}
                className="glass-card p-5 rounded-2xl cursor-pointer hover:shadow-lg transition border border-white/50"
                onClick={() => handleResume(attempt)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md uppercase tracking-wide">
                    {attempt.learningGoal || 'General'}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(attempt.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1 truncate">{attempt.topic}</h4>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500">
                    Score: <span className={attempt.score >= 70 ? 'text-green-600 font-bold' : 'text-orange-500 font-bold'}>
                      {attempt.score ? `${attempt.score.toFixed(0)}%` : 'N/A'}
                    </span>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Resume →</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
