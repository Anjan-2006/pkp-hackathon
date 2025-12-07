import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  // 1. Who and When
  userId: String,
  createdAt: { type: Date, default: Date.now },

  // 2. User Inputs
  topic: String,
  confidenceLevel: { type: Number, min: 1, max: 5 },
  learningGoal: String,

  // 3. AI Generated Content
  explanation: String,
  example: String,
  quiz: [{
    question: String,
    options: [String],
    correct: Number,     // Index of correct option (0-3)
    userAnswer: Number,  // Index of user's selected option (added after submit)
  }],

  // 4. Performance Metrics (Added after quiz submit)
  score: Number,             // Percentage (0-100)
  forgetProbability: Number, // AI Prediction (0-100)

  // 5. Chat History (NEW)
  chatHistory: [{
    sender: { type: String, enum: ['user', 'ai', 'system'] },
    text: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Attempt', attemptSchema);
