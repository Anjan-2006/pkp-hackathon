import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ResultCard } from '../components/ResultCard';
import { sendReminder } from '../services/api';

export const ResultsPage = ({ result, onRestart }) => {
  const [reminderSent, setReminderSent] = React.useState(false);

  useEffect(() => {
    if (result.score >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  const handleSendReminder = async (channel) => {
    try {
      await sendReminder(result.topic || 'Review', channel);
      setReminderSent(true);
      setTimeout(() => setReminderSent(false), 3000);
    } catch (error) {
      console.error('Reminder error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="max-w-2xl w-full"
      >
        <ResultCard
          score={result.score}
          forgetProbability={result.forgetProbability}
          feedback={result.feedback}
          onRestart={onRestart}
        />

        {/* Reminder Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass-card p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">⏰ Schedule a Reminder</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleSendReminder('email')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition shadow-md"
            >
              📧 Email
            </button>
            <button
              onClick={() => handleSendReminder('whatsapp')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition shadow-md"
            >
              💬 WhatsApp
            </button>
          </div>
          {reminderSent && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 mt-3 text-sm font-bold text-center"
            >
              ✅ Reminder scheduled successfully!
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
