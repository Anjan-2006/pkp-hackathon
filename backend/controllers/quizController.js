import Attempt from '../models/Attempt.js';
import QuizAttempt from '../models/QuizAttempt.js';
import TopicHistory from '../models/TopicHistory.js'; // Ensure imported
import { predictForgetProbability } from '../services/mlPredictor.js';
import { generateCustomQuiz } from '../langchain/pipeline.js'; // Import generator
import mongoose from 'mongoose';

export const submitQuiz = async (req, res, next) => {
  try {
    const { attemptId, answers } = req.body;

    // Handle temporary ID (MongoDB down scenario)
    if (attemptId && attemptId.toString().startsWith('temp_')) {
      // Calculate score manually since we can't fetch the quiz from DB
      // We'll assume a mock score for demo purposes or calculate if answers were passed back
      const mockScore = 80; // Fallback score
      const forgetProb = await predictForgetProbability(3, mockScore, 'Demo Topic');

      return res.json({
        success: true,
        score: mockScore,
        forgetProbability: forgetProb,
        feedback: '⚠️ Database offline: Results are simulated.',
      });
    }

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });

    let score = 0;
    attempt.quiz.forEach((q, idx) => {
      q.userAnswer = answers[idx];
      if (answers[idx] === q.correct) score++;
    });

    const percentage = (score / attempt.quiz.length) * 100;
    attempt.score = percentage;
    attempt.forgetProbability = await predictForgetProbability(
      attempt.confidenceLevel,
      percentage,
      attempt.topic
    );

    await attempt.save();

    // Update the TopicHistory collection
    await updateTopicHistory(attempt.userId, attempt.topic, percentage);

    res.json({
      success: true,
      score: percentage,
      forgetProbability: attempt.forgetProbability,
      feedback: percentage >= 70 ? '✅ Great job!' : '📚 Keep practicing!',
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update or create topic history
async function updateTopicHistory(userId, topic, newScore) {
  try {
    let history = await TopicHistory.findOne({ userId, topic });
    
    if (history) {
      const totalScore = (history.avgScore * history.attempts) + newScore;
      history.attempts += 1;
      history.avgScore = totalScore / history.attempts;
      history.lastAttemptDate = new Date();
    } else {
      history = new TopicHistory({
        userId,
        topic,
        attempts: 1,
        avgScore: newScore,
        lastAttemptDate: new Date()
      });
    }
    await history.save();
  } catch (err) {
    console.error("Failed to update topic history:", err);
  }
}

// NEW: Generate and Save Quiz
export const createQuizSession = async (req, res, next) => {
  try {
    const { topic, config, userId } = req.body;
    
    // 1. Generate Quiz Content via AI
    const result = await generateCustomQuiz(topic, config);
    
    // 2. Save to DB immediately
    const newQuiz = new QuizAttempt({
      userId: userId || 'guest',
      topic,
      config,
      questions: result.quiz,
      completed: false
    });
    
    await newQuiz.save();

    res.json({ success: true, quizId: newQuiz._id, quiz: newQuiz.questions });
  } catch (error) {
    next(error);
  }
};

// NEW: Submit Quiz Result
export const submitQuizSession = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    
    const quizSession = await QuizAttempt.findById(quizId);
    if (!quizSession) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Calculate Score
    let correctCount = 0;
    quizSession.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });
    
    const score = (correctCount / quizSession.questions.length) * 100;

    // Update DB
    quizSession.userAnswers = answers;
    quizSession.score = score;
    quizSession.completed = true;
    await quizSession.save();

    // ✅ Update Topic History for Analytics
    await updateTopicHistory(quizSession.userId, quizSession.topic, score);

    // Get Analysis (Compare to previous)
    const previousQuizzes = await QuizAttempt.find({ 
      userId: quizSession.userId, 
      topic: quizSession.topic,
      completed: true,
      _id: { $ne: quizId } // Exclude current
    }).sort({ createdAt: -1 }).limit(5);

    let avgScore = 0;
    let improvement = 0;
    
    if (previousQuizzes.length > 0) {
      const totalPrev = previousQuizzes.reduce((sum, q) => sum + q.score, 0);
      avgScore = totalPrev / previousQuizzes.length;
      improvement = score - avgScore;
    }

    res.json({ 
      success: true, 
      score, 
      quizSession, 
      analysis: {
        avgScore,
        improvement,
        historyCount: previousQuizzes.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// NEW: Get Quiz History
export const getUserQuizHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const history = await QuizAttempt.find({ userId, completed: true })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};
