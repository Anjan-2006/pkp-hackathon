import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BrainCircuit, Library, Map, Workflow, BarChart2, LogOut, Calendar } from 'lucide-react';

export const Sidebar = ({ onLogout, username }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Hub', path: '/dashboard' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: BrainCircuit, label: 'Quiz', path: '/quiz' },
    { icon: Library, label: 'Resources', path: '/resources' },
    { icon: Map, label: 'Roadmap', path: '/roadmap' },
    { icon: Calendar, label: 'Timetable', path: '/timetable' }, // New Item
    { icon: Workflow, label: 'Automation', path: '/automation' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="w-64 bg-white/90 backdrop-blur-md border-r border-white/50 h-screen flex flex-col p-6 shadow-xl fixed left-0 top-0 z-50">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">E</div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg">EduLink AI</h1>
          <p className="text-xs text-gray-500">Adaptive Companion</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors text-sm font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};
