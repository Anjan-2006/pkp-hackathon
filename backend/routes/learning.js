import express from 'express';
import { generateLearningContent, getLastSession, getUserHistory, handleChat, getSessionById, handleGenerateQuiz } from '../controllers/learningController.js';
import { submitQuiz, createQuizSession, submitQuizSession, getUserQuizHistory } from '../controllers/quizController.js';
import { getProgress, getAnalytics } from '../controllers/progressController.js';
import { searchYoutube, getArticles } from '../controllers/resourceController.js';
import { generateTimetable } from '../controllers/timetableController.js'; // New Import
import { triggerReminder } from '../services/reminderService.js';

const router = express.Router();

router.post('/learn', generateLearningContent);
router.post('/chat', handleChat);
router.get('/session/last/:userId', getLastSession);
router.get('/session/:attemptId', getSessionById);
router.get('/history/:userId', getUserHistory);

// Analytics
router.get('/analytics/:userId', getAnalytics); // NEW ROUTE

// Resource Routes
router.get('/resources/youtube', searchYoutube); // NEW ROUTE
router.get('/resources/articles', getArticles); // NEW ROUTE

// Timetable Route
router.post('/timetable/generate', generateTimetable); // New Route

// Quiz Routes
router.post('/quiz/submit', submitQuiz); // Old route (keep for backward compatibility if needed)
router.post('/quiz/create', createQuizSession); // NEW
router.post('/quiz/finish', submitQuizSession); // NEW
router.get('/quiz/history/:userId', getUserQuizHistory); // NEW

router.get('/progress/:userId', getProgress);
router.post('/reminder-trigger', triggerReminder);

export default router;
