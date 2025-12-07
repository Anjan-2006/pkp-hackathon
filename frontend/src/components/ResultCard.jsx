import React from 'react';

export const ResultCard = ({ score, forgetProbability, feedback, onRestart }) => (
  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg shadow-md border-2 border-green-300 text-center">
    <h2 className="text-3xl font-bold mb-4">Quiz Complete! 🎉</h2>
    
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <p className="text-gray-600 text-sm mb-2">Your Score</p>
        <p className="text-4xl font-bold text-green-600">{score.toFixed(0)}%</p>
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-2">Forget Probability</p>
        <p className="text-4xl font-bold text-red-500">{forgetProbability}%</p>
      </div>
    </div>

    <p className="text-xl font-semibold text-gray-800 mb-4">{feedback}</p>
    
    <div className="bg-white p-4 rounded-lg mb-6 text-left">
      <p className="text-sm text-gray-700">
        💡 <strong>Insight:</strong> Based on your score, you have a {forgetProbability}% chance of forgetting this material in 7 days. Schedule a review reminder!
      </p>
    </div>

    <button
      onClick={onRestart}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition"
    >
      Learn Another Topic 📚
    </button>
  </div>
);
