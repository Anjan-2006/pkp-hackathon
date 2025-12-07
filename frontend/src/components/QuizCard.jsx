import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const QuizCard = ({ quiz, onAnswer, loading, timerSettings }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timerSettings || 0);

  const current = quiz[currentIdx];

  // Timer Logic
  useEffect(() => {
    if (!timerSettings || timerSettings === 0) return;

    setTimeLeft(timerSettings); // Reset timer on new question

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(); // Auto-advance
          return timerSettings;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, timerSettings]);

  const handleSelect = (optIdx) => {
    setAnswers({ ...answers, [currentIdx]: optIdx });
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else if (onAnswer) {
      onAnswer(Object.values(answers));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-400 relative">
      {/* Timer Display */}
      {timerSettings > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full">
          <Clock size={16} />
          {timeLeft}s
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4">
        Question {currentIdx + 1}/{quiz.length}
      </h3>
      <p className="text-gray-800 mb-4 font-medium text-lg">{current.question}</p>
      <div className="space-y-3">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left px-4 py-4 rounded-xl border-2 transition font-medium ${
              answers[currentIdx] === idx
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={loading}
        className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition shadow-md"
      >
        {currentIdx === quiz.length - 1 ? 'Submit Quiz' : 'Next Question'}
      </button>
    </div>
  );
};
