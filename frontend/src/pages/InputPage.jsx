import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { TopicSelection } from '../components/TopicSelection';
import { ConfidenceSelect } from '../components/ConfidenceSelect';
import { GoalSelect } from '../components/GoalSelect';
import { DemoToggle } from '../components/DemoToggle';

export const InputPage = ({ onSubmit, loading, isDemoMode, setIsDemoMode }) => {
  const [topic, setTopic] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [goal, setGoal] = useState('');

  const demoData = {
    topic: 'React Hooks',
    confidence: 3,
    goal: 'Job Promotion',
  };

  const handleSubmit = () => {
    const data = isDemoMode ? demoData : { topic, confidence, goal };
    if (!data.topic || !data.confidence || !data.goal) {
      alert('Please fill all fields!');
      return;
    }
    onSubmit(data);
  };

  useEffect(() => {
    if (isDemoMode) {
      setTopic(demoData.topic);
      setConfidence(demoData.confidence);
      setGoal(demoData.goal);
    }
  }, [isDemoMode]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <DemoToggle isDemoMode={isDemoMode} setIsDemoMode={setIsDemoMode} />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card w-full max-w-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="text-center mb-12 relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            EduLink AI
          </h1>
          <p className="text-gray-500 text-lg font-medium">Your Adaptive Learning Companion</p>
        </div>

        <div className="space-y-10 relative z-10">
          <TopicSelection value={topic} onChange={setTopic} />
          <ConfidenceSelect value={confidence} onChange={setConfidence} />
          <GoalSelect value={goal} onChange={setGoal} />

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 px-8 rounded-2xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl mt-4"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Crafting your path...</span>
              </>
            ) : (
              <>
                <span>Start Learning Journey</span>
                <Sparkles size={24} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
