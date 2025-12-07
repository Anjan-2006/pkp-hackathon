import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  googleId: { type: String }, // New field for OAuth
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// 🔒 Hash password before saving (Salting & Hashing)
userSchema.pre('save', async function (next) {
  // Only hash if password exists and is modified
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔑 Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // No password set (Google user)
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
