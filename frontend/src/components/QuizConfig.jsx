import React, { useState } from 'react';
import { Settings, Clock, BrainCircuit, Zap } from 'lucide-react';

export const QuizConfig = ({ onStart, loading }) => {
  const [config, setConfig] = useState({
    difficulty: 'Medium',
    numQuestions: 5,
    style: 'Direct',
    includeTrick: false,
    includeTrueFalse: false,
    timer: 0 // 0 = No timer, value in seconds
  });

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl mb-4 text-indigo-600">
          <Settings size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Configure Your Quiz</h2>
        <p className="text-gray-500">Customize the challenge to fit your needs.</p>
      </div>

      <div className="space-y-6">
        {/* Row 1: Difficulty & Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
            <select 
              value={config.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Questions</label>
            <select 
              value={config.numQuestions}
              onChange={(e) => handleChange('numQuestions', Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
            </select>
          </div>
        </div>

        {/* Row 2: Style & Timer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <BrainCircuit size={16} /> Question Style
            </label>
            <select 
              value={config.style}
              onChange={(e) => handleChange('style', e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Direct">Direct (Concept Recall)</option>
              <option value="Scenario-Based">Scenario-Based (Application)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={16} /> Timer (Per Question)
            </label>
            <select 
              value={config.timer}
              onChange={(e) => handleChange('timer', Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value={0}>No Timer</option>
              <option value={10}>10 Seconds</option>
              <option value={30}>30 Seconds</option>
              <option value={60}>1 Minute</option>
            </select>
          </div>
        </div>

        {/* Row 3: Toggles */}
        <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.includeTrick}
              onChange={(e) => handleChange('includeTrick', e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">Include Trick Questions</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.includeTrueFalse}
              onChange={(e) => handleChange('includeTrueFalse', e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">Include True/False</span>
          </label>
        </div>

        <button
          onClick={() => onStart(config)}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>Generating Quiz...</>
          ) : (
            <>Generate Quiz <Zap size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
};
