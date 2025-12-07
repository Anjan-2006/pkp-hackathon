import mongoose from 'mongoose';

const topicHistorySchema = new mongoose.Schema({
  userId: String,
  topic: String,
  attempts: { type: Number, default: 1 },
  avgScore: { type: Number, default: 0 },
  lastAttemptDate: Date,
}, { timestamps: true });

export default mongoose.model('TopicHistory', topicHistorySchema);
