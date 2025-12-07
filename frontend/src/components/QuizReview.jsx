import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const QuizReview = ({ quizSession, analysis }) => {
  const { questions, userAnswers, score } = quizSession;

  return (
    <div className="space-y-8">
      {/* Analysis Card */}
      {analysis && (
        <div className="glass-card p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-indigo-600" /> Performance Analysis
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Current Score</p>
              <p className="text-2xl font-extrabold text-gray-900">{score.toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Average Score</p>
              <p className="text-2xl font-extrabold text-gray-600">
                {analysis.historyCount > 0 ? `${analysis.avgScore.toFixed(0)}%` : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Improvement</p>
              <p className={`text-2xl font-extrabold ${analysis.improvement >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {analysis.improvement > 0 ? '+' : ''}{analysis.improvement.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Questions Review */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Detailed Review</h3>
        {questions.map((q, idx) => {
          const isCorrect = userAnswers[idx] === q.correct;
          return (
            <div key={idx} className={`glass-card p-6 rounded-2xl border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-800 text-lg">Q{idx + 1}: {q.question}</h4>
                {isCorrect ? <CheckCircle className="text-green-500 flex-shrink-0" /> : <XCircle className="text-red-500 flex-shrink-0" />}
              </div>
              
              <div className="space-y-2 mb-4">
                {q.options.map((opt, optIdx) => (
                  <div 
                    key={optIdx}
                    className={`p-3 rounded-lg text-sm font-medium flex justify-between items-center ${
                      optIdx === q.correct 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : optIdx === userAnswers[idx] 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <span>{opt}</span>
                    {optIdx === q.correct && <span className="text-xs font-bold uppercase">Correct Answer</span>}
                    {optIdx === userAnswers[idx] && optIdx !== q.correct && <span className="text-xs font-bold uppercase">Your Answer</span>}
                  </div>
                ))}
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl text-sm text-indigo-800">
                <span className="font-bold">Explanation: </span>
                {q.explanation || "No explanation provided."}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
