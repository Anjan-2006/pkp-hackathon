import mongoose from 'mongoose';

const automationEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'automationmemails' }); // Explicitly naming the collection

export default mongoose.model('AutomationEmail', automationEmailSchema);
