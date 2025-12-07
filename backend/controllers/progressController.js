import Attempt from '../models/Attempt.js';
import TopicHistory from '../models/TopicHistory.js';
import QuizAttempt from '../models/QuizAttempt.js';

export const getProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const attempts = await Attempt.find({ userId });
    const topicHistory = await TopicHistory.find({ userId });

    const stats = {
      totalAttempts: attempts.length,
      avgScore: attempts.length ? 
        (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(2) : 0,
      topicsLearned: topicHistory.length,
      history: topicHistory,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // 1. Fetch Data
    const topicStats = await TopicHistory.find({ userId });
    const quizzes = await QuizAttempt.find({ userId, completed: true }).sort({ createdAt: 1 });
    const allAttempts = await Attempt.find({ userId }).select('topic createdAt');

    // 2. Initialize Topic Map
    const topicMap = {};

    const initTopic = (topic) => {
      if (!topicMap[topic]) {
        topicMap[topic] = {
          topic,
          sessions: 0,
          quizzes: 0,
          totalScore: 0,
          bestScore: 0,
          scores: [], 
          lastLearned: null,
          difficultyStats: {
            Easy: { total: 0, count: 0 },
            Medium: { total: 0, count: 0 },
            Hard: { total: 0, count: 0 }
          }
        };
      }
    };

    // Process History
    topicStats.forEach(t => {
      initTopic(t.topic);
      topicMap[t.topic].sessions = t.attempts;
      topicMap[t.topic].lastLearned = t.lastAttemptDate;
    });

    // Process Raw Attempts
    allAttempts.forEach(a => {
      initTopic(a.topic);
      if (!topicStats.find(t => t.topic === a.topic)) {
         topicMap[a.topic].sessions += 1;
      }
      if (!topicMap[a.topic].lastLearned || new Date(a.createdAt) > new Date(topicMap[a.topic].lastLearned)) {
        topicMap[a.topic].lastLearned = a.createdAt;
      }
    });

    // Global Stats Accumulators
    const heatmapData = {};
    const scatterData = [];
    const globalDifficultyStats = {
      Easy: { total: 0, count: 0 },
      Medium: { total: 0, count: 0 },
      Hard: { total: 0, count: 0 }
    };

    // Process Quizzes
    quizzes.forEach(q => {
      initTopic(q.topic);
      const t = topicMap[q.topic];
      
      t.quizzes++;
      t.totalScore += q.score;
      t.bestScore = Math.max(t.bestScore, q.score);
      t.scores.push({ date: q.createdAt, score: q.score });

      // Difficulty Stats per topic
      const diff = q.config?.difficulty || 'Medium';
      if (t.difficultyStats[diff]) {
        t.difficultyStats[diff].total += q.score;
        t.difficultyStats[diff].count += 1;
      }
      // Global Difficulty Stats
      if (globalDifficultyStats[diff]) {
        globalDifficultyStats[diff].total += q.score;
        globalDifficultyStats[diff].count += 1;
      }

      // Heatmap
      const date = new Date(q.createdAt).toISOString().split('T')[0];
      if (!heatmapData[date]) heatmapData[date] = 0;
      heatmapData[date] += 10; // 10 mins per quiz

      // Scatter Data
      const estimatedTime = (q.config?.numQuestions || 5) * 2; 
      scatterData.push({
        time: estimatedTime,
        score: q.score,
        topic: q.topic
      });
    });

    // Add session time to heatmap
    allAttempts.forEach(a => {
      const date = new Date(a.createdAt).toISOString().split('T')[0];
      if (!heatmapData[date]) heatmapData[date] = 0;
      heatmapData[date] += 30; 
    });

    // Format Topics Data
    const topicsData = Object.values(topicMap).map(t => {
      const avgScore = t.quizzes > 0 ? (t.totalScore / t.quizzes) : 0;
      
      const difficultyAccuracy = {
        Easy: t.difficultyStats.Easy.count > 0 ? Math.round(t.difficultyStats.Easy.total / t.difficultyStats.Easy.count) : 0,
        Medium: t.difficultyStats.Medium.count > 0 ? Math.round(t.difficultyStats.Medium.total / t.difficultyStats.Medium.count) : 0,
        Hard: t.difficultyStats.Hard.count > 0 ? Math.round(t.difficultyStats.Hard.total / t.difficultyStats.Hard.count) : 0,
      };

      return {
        topic: t.topic,
        sessions: t.sessions,
        quizzes: t.quizzes,
        avgScore: avgScore,
        bestScore: t.bestScore,
        trend: t.scores,
        lastLearned: t.lastLearned,
        timeInvested: (t.sessions * 30) + (t.quizzes * 10),
        difficultyAccuracy
      };
    });

    // Format Global Difficulty
    const globalDifficultyAccuracy = {
      Easy: globalDifficultyStats.Easy.count > 0 ? Math.round(globalDifficultyStats.Easy.total / globalDifficultyStats.Easy.count) : 0,
      Medium: globalDifficultyStats.Medium.count > 0 ? Math.round(globalDifficultyStats.Medium.total / globalDifficultyStats.Medium.count) : 0,
      Hard: globalDifficultyStats.Hard.count > 0 ? Math.round(globalDifficultyStats.Hard.total / globalDifficultyStats.Hard.count) : 0,
    };

    // Global Trend
    const globalTrend = quizzes.map(q => ({
      date: q.createdAt,
      score: q.score,
      topic: q.topic
    }));

    res.json({
      success: true,
      overview: {
        totalSessions: allAttempts.length,
        totalQuizzes: quizzes.length,
        globalAvgScore: quizzes.length > 0 ? (quizzes.reduce((acc, q) => acc + q.score, 0) / quizzes.length) : 0,
        topicsCount: topicsData.length,
        totalTimeInvested: topicsData.reduce((acc, t) => acc + t.timeInvested, 0)
      },
      charts: {
        heatmap: heatmapData,
        topics: topicsData,
        globalTrend,
        globalDifficultyAccuracy,
        scatter: scatterData // ✅ Added this back
      }
    });

  } catch (error) {
    next(error);
  }
};
