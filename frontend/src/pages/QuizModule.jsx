import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, ArrowLeft, Settings, History, Eye } from 'lucide-react';
import { QuizCard } from '../components/QuizCard';
import { QuizConfig } from '../components/QuizConfig';
import { QuizReview } from '../components/QuizReview';
import { useLearning } from '../context/LearningContext';
import { createQuiz, finishQuiz, getQuizHistory } from '../services/api';

export const QuizModule = () => {
  const { currentSession, updateStats } = useLearning();
  const navigate = useNavigate();
  
  // States
  const [step, setStep] = useState('config'); // config, quiz, result, history, review_history
  const [loading, setLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [reviewAnalysis, setReviewAnalysis] = useState(null); // NEW: Store analysis for review

  // 1. Generate Quiz
  const handleStartQuiz = async (config) => {
    setLoading(true);
    try {
      // Use user ID from localStorage or context (assuming guest if not found)
      const userId = localStorage.getItem('userId');
      const res = await createQuiz(currentSession.topic, config, userId);
      setActiveQuiz(res.data.quiz);
      setQuizId(res.data.quizId);
      setStep('quiz');
    } catch (error) {
      console.error(error);
      alert('Failed to generate quiz.');
    }
    setLoading(false);
  };

  // 2. Submit Answers
  const handleQuizSubmit = async (answers) => {
    setLoading(true);
    try {
      const res = await finishQuiz(quizId, answers);
      setResultData(res.data); // Contains score, quizSession, analysis
      updateStats(res.data.score > 70 ? 100 : 20);
      setStep('result');
    } catch (error) {
      console.error(error);
      alert('Failed to submit');
    }
    setLoading(false);
  };

  // 3. Fetch History
  const handleShowHistory = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const res = await getQuizHistory(userId);
      setHistoryList(res.data.history);
      setStep('history');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // NEW: Calculate analytics for past quiz
  const handleReviewHistoryItem = (item) => {
    // Filter quizzes of same topic, older than current item
    const relevantHistory = historyList.filter(h => 
      h.topic === item.topic && 
      new Date(h.createdAt) < new Date(item.createdAt)
    );

    let avgScore = 0;
    let improvement = 0;

    if (relevantHistory.length > 0) {
      const total = relevantHistory.reduce((sum, h) => sum + h.score, 0);
      avgScore = total / relevantHistory.length;
      improvement = item.score - avgScore;
    }

    const analysis = {
      avgScore,
      improvement,
      historyCount: relevantHistory.length
    };

    setSelectedHistoryItem(item);
    setReviewAnalysis(analysis); // Set calculated analysis
    setStep('review_history');
  };

  if (!currentSession.topic) return <div className="p-8 text-center">No active topic. Start a topic from Dashboard first.</div>;

  // --- RENDER: CONFIGURATION ---
  if (step === 'config') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={handleShowHistory} className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition">
            <History size={20} /> Past Quizzes
          </button>
        </div>
        <QuizConfig onStart={handleStartQuiz} loading={loading} />
      </div>
    );
  }

  // --- RENDER: HISTORY LIST ---
  if (step === 'history') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
          <button onClick={() => setStep('config')} className="flex items-center gap-2 text-gray-600 font-bold hover:bg-gray-100 px-4 py-2 rounded-xl">
            <ArrowLeft size={20} /> Back
          </button>
        </div>
        <div className="space-y-4">
          {historyList.map((item) => (
            <div key={item._id} className="glass-card p-6 rounded-2xl flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{item.topic}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()} • {item.config.difficulty} • {item.questions.length} Qs
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className={`text-xl font-extrabold ${item.score >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                  {item.score.toFixed(0)}%
                </div>
                <button 
                  onClick={() => handleReviewHistoryItem(item)}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>
          ))}
          {historyList.length === 0 && <p className="text-center text-gray-500">No past quizzes found.</p>}
        </div>
      </div>
    );
  }

  // --- RENDER: REVIEW HISTORY ITEM ---
  if (step === 'review_history') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Review: {selectedHistoryItem.topic}</h1>
          <button onClick={() => setStep('history')} className="flex items-center gap-2 text-gray-600 font-bold hover:bg-gray-100 px-4 py-2 rounded-xl">
            <ArrowLeft size={20} /> Back to List
          </button>
        </div>
        {/* Pass calculated analysis here */}
        <QuizReview quizSession={selectedHistoryItem} analysis={reviewAnalysis} />
      </div>
    );
  }

  // --- RENDER: RESULTS (Immediate) ---
  if (step === 'result' && resultData) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-gray-500">Here is your detailed breakdown</p>
        </div>

        <QuizReview quizSession={resultData.quizSession} analysis={resultData.analysis} />

        <div className="flex justify-center gap-4 pb-10">
          <button 
            onClick={() => setStep('config')}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
          >
            <Settings size={20} /> New Quiz
          </button>
          <button 
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
          >
            <ArrowLeft size={20} /> Back to Learning
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: ACTIVE QUIZ ---
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Skill Check</h1>
        <button onClick={() => setStep('config')} className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1">
          <RotateCcw size={14} /> Restart
        </button>
      </div>
      <QuizCard 
        quiz={activeQuiz} 
        onAnswer={handleQuizSubmit} 
        loading={loading} 
        timerSettings={null} // Timer config not passed in this snippet, but can be added
      />
    </div>
  );
};
