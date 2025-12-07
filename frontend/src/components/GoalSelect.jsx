import React from 'react';

const goals = [
  'Interview Preparation',
  'Job Promotion',
  'Certification Exam',
  'Personal Mastery',
  'Project Work',
];

export const GoalSelect = ({ value, onChange }) => (
  <div className="w-full">
    <label className="block text-lg font-bold text-gray-800 mb-3">
      🎯 What's your learning goal?
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="custom-select w-full px-6 py-4 bg-white/80 border-2 border-indigo-100 rounded-2xl text-gray-700 font-semibold text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm hover:border-indigo-300 cursor-pointer"
      >
        <option value="">Select a goal...</option>
        {goals.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
    </div>
  </div>
);
