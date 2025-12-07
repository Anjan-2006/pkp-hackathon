import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Use 127.0.0.1 explicitly to avoid IPv6 resolution issues
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edulink-ai');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // We don't exit the process so the app can still run in "Offline Mode"
    console.log('⚠️ App running without Database');
  }
};
