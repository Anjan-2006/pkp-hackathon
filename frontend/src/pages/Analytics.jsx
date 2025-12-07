import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Activity, Clock, Target, Zap, Filter, Brain, Layers, Calendar, AlertCircle } from 'lucide-react';
import { fetchAnalytics } from '../services/api';
import { motion } from 'framer-motion';

// --- Premium SVG Chart Components ---

const HeatmapChart = ({ data }) => {
  const today = new Date();
  const weeks = 53; // Show full year
  const days = [];
  
  // Generate dates: oldest to newest
  for (let i = (weeks * 7) - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const getColor = (val) => {
    if (!val) return 'fill-gray-100';
    if (val < 30) return 'fill-indigo-200';
    if (val < 60) return 'fill-indigo-400';
    return 'fill-indigo-600';
  };

  // Calculate month labels
  const months = [];
  let lastMonth = -1;

  days.forEach((date, index) => {
    // Check only the first day of each week (index % 7 === 0)
    if (index % 7 === 0) {
      const month = date.getMonth();
      if (month !== lastMonth) {
        const weekIndex = Math.floor(index / 7);
        // Avoid label overlap
        if (months.length === 0 || weekIndex - months[months.length - 1].weekIndex > 3) {
             months.push({ 
                x: weekIndex * 14, 
                label: date.toLocaleString('default', { month: 'short' }),
                weekIndex
            });
            lastMonth = month;
        }
      }
    }
  });

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${weeks * 14} 110`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Month Labels */}
        {months.map((m, i) => (
          <text 
            key={i} 
            x={m.x} 
            y="10" 
            className="fill-gray-400 font-bold uppercase tracking-wider" 
            style={{ fontSize: '10px' }}
          >
            {m.label}
          </text>
        ))}

        {/* Grid */}
        {Array.from({ length: weeks }).map((_, w) => (
          <g key={w} transform={`translate(${w * 14}, 18)`}>
            {Array.from({ length: 7 }).map((_, d) => {
              const dateIndex = w * 7 + d;
              if (dateIndex >= days.length) return null;
              const dateObj = days[dateIndex];
              const dateStr = dateObj.toISOString().split('T')[0];
              const value = (data && data[dateStr]) || 0;
              
              return (
                <rect
                  key={d}
                  x="0"
                  y={d * 12}
                  width="10"
                  height="10"
                  rx="2"
                  className={`${getColor(value)} transition-all duration-300 hover:opacity-80 cursor-pointer`}
                >
                  <title>{`${dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}: ${value} mins`}</title>
                </rect>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
};

const TimeDonutChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400">No data</div>;

  const total = data.reduce((acc, d) => acc + d.value, 0);
  let cumulativePercent = 0;

  if (total === 0) return <div className="h-full flex items-center justify-center text-gray-400">No time recorded</div>;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = data.map(d => ({ ...d, percent: d.value / total }));

  return (
    <div className="flex items-center gap-6 h-full">
      <div className="w-32 h-32 relative flex-shrink-0">
        <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
          {slices.map((slice, i) => {
            const percent = slice.value / total;
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            cumulativePercent += percent;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = percent > 0.5 ? 1 : 0;
            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ');
            return <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.05" />;
          })}
          <circle cx="0" cy="0" r="0.7" fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl font-bold text-gray-800">{Math.round(total / 60)}h</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto max-h-40 custom-scrollbar">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }}></div>
              <span className="text-gray-600 truncate max-w-[100px]" title={slice.label}>{slice.label}</span>
            </div>
            <span className="font-bold text-gray-700">{(slice.percent * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScoreLineChart = ({ data }) => {
  if (!data || data.length < 2) return <div className="h-full flex items-center justify-center text-gray-400 text-sm">Not enough data for trend</div>;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - d.score;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full px-2 pb-4">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <line x1="0" y1="25" x2="100" y2="25" stroke="#f3f4f6" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#f3f4f6" strokeWidth="0.5" />
        
        <polyline 
          fill="none" 
          stroke="url(#gradientLine)" 
          strokeWidth="3" 
          points={points} 
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        
        {data.map((d, i) => (
          <circle 
            key={i} 
            cx={(i / (data.length - 1)) * 100} 
            cy={100 - d.score} 
            r="1.5" 
            fill="white" 
            stroke="#4f46e5" 
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="hover:r-2 transition-all"
          >
            <title>{`Score: ${d.score}%`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
};

const BarChart = ({ data, color = "bg-indigo-500" }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400">No data</div>;
  
  const maxVal = Math.max(...data.map(d => d.value), 100);

  return (
    <div className="h-full w-full flex flex-col justify-end gap-3 px-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3 w-full group">
          <span className="text-xs font-medium text-gray-500 w-24 truncate text-right" title={d.label}>{d.label}</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`h-full rounded-full ${color}`}
            />
          </div>
          <span className="text-xs font-bold text-gray-700 w-8 text-right">{d.value.toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
};

const DifficultyChart = ({ data }) => {
  if (!data) return null;
  const levels = [
    { label: 'Easy', val: data.Easy || 0, color: 'bg-green-400' },
    { label: 'Medium', val: data.Medium || 0, color: 'bg-yellow-400' },
    { label: 'Hard', val: data.Hard || 0, color: 'bg-red-400' }
  ];

  return (
    <div className="flex items-end justify-around h-full pb-2 px-4 gap-4">
      {levels.map((l) => (
        <div key={l.label} className="flex flex-col items-center gap-2 w-1/3 group h-full justify-end">
          <div className="relative w-full flex justify-center items-end h-full bg-gray-50 rounded-xl overflow-hidden">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${l.val}%` }}
              className={`w-full max-w-[40px] rounded-t-lg transition-all ${l.color} opacity-80 group-hover:opacity-100`}
            />
            <span className="absolute bottom-2 text-gray-800 font-bold text-xs bg-white/80 px-1 rounded backdrop-blur-sm">{l.val}%</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{l.label}</span>
        </div>
      ))}
    </div>
  );
};

const CorrelationChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400">No quiz data yet</div>;

  const maxTime = Math.max(...data.map(d => d.time), 30);
  
  return (
    <div className="relative h-full w-full border-l border-b border-gray-200">
      {data.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="absolute w-3 h-3 rounded-full bg-indigo-500/60 hover:bg-indigo-600 hover:scale-150 transition-all cursor-pointer"
          style={{
            left: `${(d.time / maxTime) * 90}%`,
            bottom: `${d.score}%`,
          }}
          title={`Score: ${d.score}%, Time: ${d.time}m`}
        />
      ))}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 font-bold">Time Invested →</div>
      <div className="absolute top-2 left-2 text-xs text-gray-400 font-bold">Score ↑</div>
    </div>
  );
};

// --- Main Component ---

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('ALL');

  const SUPPORTED_TOPICS = [
    "Data Structures and Algorithms",
    "Operating Systems",
    "Database Management Systems",
    "Computer Networks",
    "Computer Organization and Architecture",
    "System Design (LLD + HLD)",
    "MERN Stack",
    "Machine Learning Basics",
    "Deep Learning Basics"
  ];

  useEffect(() => {
    const loadAnalytics = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const res = await fetchAnalytics(userId);
          if (res.data.success) {
            setData(res.data);
          }
        } catch (error) {
          console.error("Failed to load analytics", error);
        }
      }
      setLoading(false);
    };
    loadAnalytics();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
  </div>;
  
  if (!data) return <div className="p-10 text-center">No data available yet. Start learning!</div>;

  const { charts, overview } = data;
  const isAll = viewMode === 'ALL';

  // --- Data Preparation ---
  
  const heatmapData = charts.heatmap || {};

  const timeData = isAll 
    ? (charts.topics || []).map((t, i) => ({ 
        label: t.topic, 
        value: t.timeInvested, 
        color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6] 
      })).filter(d => d.value > 0)
    : [{ label: viewMode, value: charts.topics?.find(t => t.topic === viewMode)?.timeInvested || 0, color: '#6366f1' }];

  const trendData = isAll 
    ? (charts.globalTrend || [])
    : (charts.topics?.find(t => t.topic === viewMode)?.trend || []);

  const weakestTopicsData = isAll 
    ? (charts.topics || [])
        .filter(t => t.avgScore > 0)
        .sort((a, b) => a.avgScore - b.avgScore)
        .slice(0, 5)
        .map(t => ({ label: t.topic, value: t.avgScore }))
    : (charts.topics?.find(t => t.topic === viewMode)?.trend?.slice(-5).map((t, i) => ({ label: `Attempt ${i+1}`, value: t.score })) || []);

  const difficultyData = isAll 
    ? (charts.globalDifficultyAccuracy || { Easy: 0, Medium: 0, Hard: 0 })
    : (charts.topics?.find(t => t.topic === viewMode)?.difficultyAccuracy || { Easy: 0, Medium: 0, Hard: 0 });

  // Safe access for scatter data
  const filteredScatter = isAll 
    ? (charts.scatter || []) 
    : (charts.scatter || []).filter(d => d.topic === viewMode);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10 space-y-8">
      
      {/* Floating Summary Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-4 z-40 mx-auto max-w-5xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-4 flex justify-between items-center px-8"
      >
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Quizzes</p>
            <p className="text-xl font-black text-gray-800">{isAll ? overview.totalQuizzes : (charts.topics?.find(t => t.topic === viewMode)?.quizzes || 0)}</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Avg Score</p>
            <p className="text-xl font-black text-indigo-600">{isAll ? overview.globalAvgScore.toFixed(0) : (charts.topics?.find(t => t.topic === viewMode)?.avgScore.toFixed(0) || 0)}%</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Time Invested</p>
            <p className="text-xl font-black text-gray-800">
              {Math.round((isAll ? overview.totalTimeInvested : (charts.topics?.find(t => t.topic === viewMode)?.timeInvested || 0)) / 60)}h
            </p>
          </div>
        </div>
        
        {/* Topic Toggle */}
        <div className="relative">
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="appearance-none bg-indigo-50 border border-indigo-100 text-indigo-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm cursor-pointer hover:bg-indigo-100 transition-colors"
          >
            <option value="ALL">All Topics</option>
            {SUPPORTED_TOPICS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={16} />
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        
        {/* 1. Learning Consistency Heatmap */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-green-500" /> Learning Consistency
          </h2>
          <HeatmapChart data={heatmapData} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. Time Spent Per Topic */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" /> Time Distribution
            </h2>
            <div className="flex-1 min-h-[200px]">
              <TimeDonutChart data={timeData} />
            </div>
          </motion.div>

          {/* 3. Global Score Progress */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-500" /> {isAll ? 'Global Score Progress' : 'Topic Score Trend'}
            </h2>
            <div className="flex-1 min-h-[200px]">
              <ScoreLineChart data={trendData} />
            </div>
          </motion.div>

          {/* 4. Weakest Topics / Recent Performance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              {isAll ? <AlertCircle size={20} className="text-orange-500" /> : <Activity size={20} className="text-indigo-500" />}
              {isAll ? 'Areas for Improvement (Lowest Avg Score)' : 'Recent Quiz Performance'}
            </h2>
            <div className="flex-1 min-h-[200px]">
              <BarChart data={weakestTopicsData} color={isAll ? 'bg-orange-400' : 'bg-indigo-500'} />
            </div>
          </motion.div>

          {/* 5. Difficulty Accuracy Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-purple-500" /> Difficulty Mastery
            </h2>
            <div className="flex-1 min-h-[200px]">
              <DifficultyChart data={difficultyData} />
            </div>
          </motion.div>

        </div>

        {/* 6. Correlation Scatter (Full Width Bottom) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-blue-600" /> Time vs Score Correlation
          </h2>
          <div className="h-64 w-full">
            <CorrelationChart data={filteredScatter} />
          </div>
        </motion.div>

      </div>
    </div>
  );
};
