import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { TopicSelection } from '../components/TopicSelection';
import { ConfidenceSelect } from '../components/ConfidenceSelect';
import { GoalSelect } from '../components/GoalSelect';
import { useLearning } from '../context/LearningContext';
import { generateContent } from '../services/api';

export const Onboarding = ({ userId }) => {
  const navigate = useNavigate();
  const { startSession } = useLearning();
  const [loading, setLoading] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [goal, setGoal] = useState('');

  const handleSubmit = async () => {
    if (!topic || !confidence || !goal) return alert('Please fill all fields');
    
    setLoading(true);
    try {
      const res = await generateContent(topic, confidence, goal, userId);
      startSession({ topic, confidence, goal }, res.data.data, res.data.attemptId);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to generate path');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl p-10 rounded-[2rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Target Your Dream Role</h1>
          <p className="text-gray-500">Select a core subject to boost your placement readiness.</p>
        </div>

        <div className="space-y-8">
          <TopicSelection value={topic} onChange={setTopic} />
          <ConfidenceSelect value={confidence} onChange={setConfidence} />
          <GoalSelect value={goal} onChange={setGoal} />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Generating Path...' : <>Start Learning <Sparkles size={20} /></>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
