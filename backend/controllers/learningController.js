import { generateLearningContent as lcGenerate, generateChatResponse, generateCustomQuiz } from '../langchain/pipeline.js'; // Updated import
import Attempt from '../models/Attempt.js';
import TopicHistory from '../models/TopicHistory.js'; // New Import
import mongoose from 'mongoose';

export const generateLearningContent = async (req, res, next) => {
  try {
    const { topic, confidenceLevel, learningGoal, userId } = req.body;
    
    if (!topic || !confidenceLevel || !learningGoal) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const content = await lcGenerate(topic, confidenceLevel, learningGoal);
    
    // Check if MongoDB is connected (readyState 1 = connected)
    if (mongoose.connection.readyState === 1) {
      const attempt = new Attempt({
        userId: userId || `demo_${Date.now()}`,
        topic,
        confidenceLevel,
        learningGoal,
        explanation: content.explanation,
        example: content.example,
        quiz: content.quiz,
      });
      await attempt.save();
      
      // ✅ Log confirmation for debugging
      console.log(`💾 Data saved to MongoDB collection 'attempts'. ID: ${attempt._id}`);
      
      res.json({ success: true, data: content, attemptId: attempt._id });
    } else {
      console.warn("⚠️ MongoDB not connected. Skipping save.");
      // Return a fake ID so the frontend flow continues
      res.json({ success: true, data: content, attemptId: `temp_${Date.now()}` });
    }

  } catch (error) {
    next(error);
  }
};

export const handleChat = async (req, res, next) => {
  try {
    const { message, topic, mode, history, attemptId } = req.body; // Added attemptId
    const reply = await generateChatResponse(message, topic, mode, history || []);

    // ✅ Save to MongoDB if we have a valid attempt ID
    if (attemptId && !attemptId.toString().startsWith('temp_')) {
      await Attempt.findByIdAndUpdate(attemptId, {
        $push: {
          chatHistory: {
            $each: [
              { sender: 'user', text: message, timestamp: new Date() },
              { sender: 'ai', text: reply, timestamp: new Date() }
            ]
          }
        }
      });
    }

    res.json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

// NEW: Get the last active session for a user
export const getLastSession = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

    // Find the most recent attempt
    const lastAttempt = await Attempt.findOne({ userId }).sort({ createdAt: -1 });

    if (!lastAttempt) {
      return res.json({ success: true, session: null });
    }

    // Reconstruct session object structure expected by frontend
    const session = {
      topic: lastAttempt.topic,
      confidence: lastAttempt.confidenceLevel,
      goal: lastAttempt.learningGoal,
      content: {
        explanation: lastAttempt.explanation,
        example: lastAttempt.example,
        quiz: lastAttempt.quiz
      },
      attemptId: lastAttempt._id,
      chatHistory: lastAttempt.chatHistory // ✅ Added chatHistory here
    };

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

// NEW: Get user's learning history
export const getUserHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

    // Fetch last 10 attempts, sorted by date descending
    // We exclude the 'quiz' array to keep the payload light
    const history = await Attempt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('topic learningGoal createdAt score confidenceLevel explanation example quiz'); 

    // Fetch topic averages to display global mastery instead of session score
    const topicStats = await TopicHistory.find({ userId });
    const scoreMap = {};
    topicStats.forEach(t => {
      scoreMap[t.topic] = t.avgScore;
    });

    const historyWithAvg = history.map(h => {
      const obj = h.toObject();
      // Override session score with topic average score if available
      if (scoreMap[h.topic] !== undefined) {
        obj.score = Math.round(scoreMap[h.topic]);
      } else {
        obj.score = null; // Ensure N/A if no quiz data
      }
      return obj;
    });

    res.json({ success: true, history: historyWithAvg });
  } catch (error) {
    next(error);
  }
};

// NEW: Get a specific session by ID (includes chat history)
export const getSessionById = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const session = {
      topic: attempt.topic,
      confidence: attempt.confidenceLevel,
      goal: attempt.learningGoal,
      content: {
        explanation: attempt.explanation,
        example: attempt.example,
        quiz: attempt.quiz
      },
      attemptId: attempt._id,
      chatHistory: attempt.chatHistory // ✅ Include chat history here
    };

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

// NEW: Handle custom quiz generation
export const handleGenerateQuiz = async (req, res, next) => {
  try {
    const { topic, config } = req.body;
    const result = await generateCustomQuiz(topic, config);
    res.json({ success: true, quiz: result.quiz });
  } catch (error) {
    next(error);
  }
};
