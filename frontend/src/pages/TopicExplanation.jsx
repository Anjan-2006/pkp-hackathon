import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const TopicExplanation = () => {
  const { currentSession } = useLearning();

  if (!currentSession.content) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Core Concepts: {currentSession.topic}</h1>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-4 text-indigo-600">
          <BookOpen />
          <h2 className="text-xl font-bold">Explanation</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">{currentSession.content.explanation}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 rounded-2xl border-l-4 border-emerald-400">
        <div className="flex items-center gap-3 mb-4 text-emerald-600">
          <Lightbulb />
          <h2 className="text-xl font-bold">Real-World Example</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">{currentSession.content.example}</p>
      </motion.div>
    </div>
  );
};
