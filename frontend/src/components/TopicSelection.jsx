import React from 'react';

export const TopicSelection = ({ value, onChange }) => (
  <div className="w-full">
    <label className="block text-lg font-bold text-gray-800 mb-3">
      📚 Select Placement Subject
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="custom-select w-full px-6 py-4 bg-white/80 border-2 border-indigo-100 rounded-2xl text-gray-700 font-semibold text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm hover:border-indigo-300 cursor-pointer"
      >
        <option value="">Select a subject...</option>
        <optgroup label="Core CS Fundamentals">
          <option value="Data Structures and Algorithms">Data Structures & Algorithms (DSA)</option>
          <option value="Operating Systems">Operating Systems (OS)</option>
          <option value="Database Management Systems">Database Management Systems (DBMS)</option>
          <option value="Computer Networks">Computer Networks (CN)</option>
          <option value="Computer Organization and Architecture">Computer Org & Architecture (COA)</option>
        </optgroup>
        <optgroup label="System Design">
          <option value="System Design (LLD + HLD)">System Design (LLD + HLD)</option>
        </optgroup>
        <optgroup label="Tech Stack">
          <option value="MERN Stack">MERN Stack Development</option>
        </optgroup>
        <optgroup label="Artificial Intelligence">
          <option value="Machine Learning Basics">Machine Learning Basics</option>
          <option value="Deep Learning Basics">Deep Learning Basics</option>
        </optgroup>
      </select>
    </div>
  </div>
);
