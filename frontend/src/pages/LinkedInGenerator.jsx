import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const LinkedInGenerator = () => {
  const { currentSession } = useLearning();
  const [tone, setTone] = useState('Professional');
  const [draft, setDraft] = useState('');
  const topic = currentSession.topic || "Adaptive Learning";

  const templates = {
    Professional: `🚀 Leveling up my Tech Placement preparation with ${topic}.\n\nI've been using EduLink AI to master core CS fundamentals, specifically focusing on ${topic}. Strengthening these concepts is crucial for cracking technical interviews.\n\n#PlacementPrep #SoftwareEngineering #InterviewReady #${topic.replace(/\s/g, '')}`,
    Motivational: `🔥 Consistency is key to cracking product-based companies! Just finished a deep dive into ${topic}.\n\nPreparing for placements can be overwhelming, but breaking it down concept by concept makes it manageable. One step closer to that dream offer!\n\n#PlacementJourney #TechCareers #Motivation #DSA`,
    Technical: `🛠️ Sharpening my engineering fundamentals: ${topic}.\n\nRevisiting the low-level details of ${topic} today. Understanding the 'why' and 'how' behind these systems is what differentiates a good engineer from a great one.\n\n#CSFundamentals #SystemDesign #EngineeringExcellence #${topic.replace(/\s/g, '')}`,
    Humble: `🌱 The more I learn about ${topic}, the more I realize there is to know.\n\nSpent today refining my understanding of ${topic} for upcoming interviews. Grateful for resources that help bridge the gap between theory and application.\n\n#StudentLife #AlwaysLearning #TechPlacement`
  };

  useEffect(() => {
    setDraft(templates[tone]);
  }, [tone, topic]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Share Your Win</h1>
      
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.keys(templates).map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${tone === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <textarea 
          className="w-full h-64 p-6 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-medium text-gray-700 text-lg leading-relaxed"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        
        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => setDraft(templates[tone])}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} /> Reset
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText(draft)}
            className="flex-1 bg-[#0077b5] hover:bg-[#006396] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Copy size={18} /> Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};
