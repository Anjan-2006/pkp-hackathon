import React from 'react';
import { motion } from 'framer-motion';

export const ConfidenceSelect = ({ value, onChange }) => (
  <div className="w-full">
    <label className="block text-lg font-bold text-gray-800 mb-3">
      💪 Your current confidence level?
    </label>
    <div className="flex gap-3 flex-wrap">
      {[
        { level: 1, emoji: '😰', label: 'Beginner' },
        { level: 2, emoji: '😐', label: 'Novice' },
        { level: 3, emoji: '🙂', label: 'Intermediate' },
        { level: 4, emoji: '😎', label: 'Advanced' },
        { level: 5, emoji: '🚀', label: 'Expert' },
      ].map(({ level, emoji, label }) => (
        <motion.button
          key={level}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(level)}
          className={`flex flex-col items-center justify-center px-2 py-4 rounded-2xl border-2 transition-all flex-1 min-w-[90px] shadow-sm ${
            value === level
              ? 'border-indigo-500 bg-gradient-to-b from-indigo-50 to-white ring-4 ring-indigo-200'
              : 'border-transparent bg-white/60 hover:bg-white hover:shadow-md'
          }`}
        >
          <span className="text-4xl mb-2 filter drop-shadow-sm transform transition-transform group-hover:scale-110">{emoji}</span>
          <span className={`text-xs font-bold tracking-wide ${value === level ? 'text-indigo-600' : 'text-gray-500'}`}>{label}</span>
        </motion.button>
      ))}
    </div>
  </div>
);
