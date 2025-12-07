import React from 'react';

export const DemoToggle = ({ isDemoMode, setIsDemoMode }) => (
  <div className="fixed top-4 right-4 flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-full shadow-sm z-50">
    <label className="text-sm font-medium text-purple-900 cursor-pointer select-none" htmlFor="demo-toggle">Demo Mode</label>
    <input
      id="demo-toggle"
      type="checkbox"
      checked={isDemoMode}
      onChange={(e) => setIsDemoMode(e.target.checked)}
      className="w-4 h-4 cursor-pointer accent-purple-600"
    />
  </div>
);
