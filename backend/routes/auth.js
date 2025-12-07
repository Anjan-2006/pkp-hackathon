import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// --- GOOGLE AUTH ROUTES ---
// 1. Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Callback from Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect('http://localhost:5173/');
  }
);

// --- EXISTING ROUTES ---

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LOGIN
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Logged in successfully', user: { id: user._id, username: user.username } });
    });
  })(req, res, next);
});

// LOGOUT
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

// CHECK SESSION
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: { id: req.user._id, username: req.user.username } });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

export default router;
