import React from 'react';
import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const Achievements = () => {
  const { achievements } = useLearning();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Hall of Fame</h1>
      <p className="text-gray-500 mb-8">Track your milestones and badges.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((m) => (
          <div key={m.id} className={`glass-card p-6 rounded-2xl flex items-center gap-4 transition-all ${m.unlocked ? 'border-green-200 bg-green-50/30' : 'opacity-60 grayscale'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-sm ${m.unlocked ? 'bg-gradient-to-br from-yellow-100 to-yellow-300 text-yellow-700' : 'bg-gray-100 text-gray-400'}`}>
              {m.unlocked ? <Trophy size={32} /> : <Lock size={32} />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">{m.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{m.desc}</p>
              {m.unlocked && (
                <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md w-fit">
                  <CheckCircle size={12} /> Unlocked {m.date}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
