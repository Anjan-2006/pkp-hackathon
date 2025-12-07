import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import learningRoutes from './routes/learning.js';
import authRoutes from './routes/auth.js';
import automationRoutes from './routes/automationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/database.js';
import passportConfig from './config/passport.js';

dotenv.config();

// Connect to Database
connectDB();

// Passport Config
passportConfig(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true, // Allow frontend origin
  credentials: true, // Allow cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(cookieParser());

// Session Config
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key_123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Debug logging
app.use((req, res, next) => {
  console.log(`👉 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ EduLink AI Backend is Running!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', learningRoutes);
app.use('/api/automation', automationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EduLink AI backend running on port ${PORT}`);
  console.log(`   - Health Check: http://localhost:${PORT}/`);

  // Check API Key status on startup
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_groq_key')) {
    console.log(`   - ⚠️  GROQ_API_KEY missing/invalid. App running in MOCK MODE.`);
  } else {
    console.log(`   - ⚡ GROQ_API_KEY detected. Using Llama3 on Groq.`);
  }
});
