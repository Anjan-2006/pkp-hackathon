import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  userId: String,
  topic: String,
  config: {
    difficulty: String,
    numQuestions: Number,
    style: String
  },
  questions: [{
    question: String,
    options: [String],
    correct: Number,
    explanation: String
  }],
  userAnswers: [Number], // Array of selected indices
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuizAttempt', quizAttemptSchema);
