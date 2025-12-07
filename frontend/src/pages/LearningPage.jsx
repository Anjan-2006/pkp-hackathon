import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import { QuizCard } from '../components/QuizCard';

export const LearningPage = ({ content, attemptId, onQuizSubmit, loading }) => {
  const [showQuiz, setShowQuiz] = useState(false);

  if (!content) return <div className="p-10 text-center text-white font-bold text-xl">Loading content...</div>;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center items-start pt-10">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl w-full"
      >
        <motion.h1 variants={item} className="text-4xl font-bold mb-8 text-white drop-shadow-md text-center">
          📖 Learning Module
        </motion.h1>

        {!showQuiz ? (
          <div className="space-y-6">
            {/* Explanation Card */}
            <motion.div variants={item} className="glass-card p-8 rounded-2xl shadow-xl border-l-8 border-indigo-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BookOpen className="text-indigo-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Concept Explanation</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">{content.explanation}</p>
            </motion.div>

            {/* Example Card */}
            <motion.div variants={item} className="glass-card p-8 rounded-2xl shadow-xl border-l-8 border-emerald-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Lightbulb className="text-emerald-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Real-World Example</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">{content.example}</p>
            </motion.div>

            {/* Start Quiz Button */}
            <motion.div variants={item} className="flex justify-center pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuiz(true)}
                className="bg-white text-indigo-600 font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-xl"
              >
                Ready for the Quiz? <ArrowRight />
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <QuizCard
              quiz={content.quiz}
              loading={loading}
              onAnswer={(answers) => onQuizSubmit(attemptId, answers)}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
