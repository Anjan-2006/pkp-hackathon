import axios from 'axios';

// Use relative path to leverage Vite proxy (which now points to 3000)
const API_BASE = '/api'; 

// OR if you are NOT using proxy, use: 'http://127.0.0.1:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Important for sessions!
});

// Auth APIs
export const loginUser = (username, password) => apiClient.post('/auth/login', { username, password });
export const registerUser = (username, password) => apiClient.post('/auth/register', { username, password });
export const logoutUser = () => apiClient.post('/auth/logout');
export const checkAuth = () => apiClient.get('/auth/user');

// Learning APIs
export const generateContent = (topic, confidenceLevel, learningGoal, userId) =>
  apiClient.post('/learn', { topic, confidenceLevel, learningGoal, userId });

export const sendChatMessage = (message, topic, mode, history, attemptId) => 
  apiClient.post('/chat', { message, topic, mode, history, attemptId });

// NEW: Generate custom quiz
export const generateQuiz = (topic, config) => 
  apiClient.post('/quiz/generate', { topic, config });

// NEW Quiz APIs
export const createQuiz = (topic, config, userId) => 
  apiClient.post('/quiz/create', { topic, config, userId });

export const finishQuiz = (quizId, answers) => 
  apiClient.post('/quiz/finish', { quizId, answers });

export const getQuizHistory = (userId) => 
  apiClient.get(`/quiz/history/${userId}`);

// NEW: Fetch Analytics
export const fetchAnalytics = (userId) => 
  apiClient.get(`/analytics/${userId}`);

// NEW: Search Videos
export const searchVideos = (query) => 
  apiClient.get(`/resources/youtube`, { params: { query } });

// NEW: Search Articles
export const searchArticles = (query) => 
  apiClient.get(`/resources/articles`, { params: { query } });

// NEW: Generate Timetable
export const generateTimetable = (prompt) => 
  apiClient.post('/timetable/generate', { prompt });

export const fetchLastSession = (userId) => 
  apiClient.get(`/session/last/${userId}`);

export const fetchSessionById = (attemptId) => 
  apiClient.get(`/session/${attemptId}`);

export const fetchUserHistory = (userId) => 
  apiClient.get(`/history/${userId}`);

export const submitQuizAnswers = (attemptId, answers) =>
  apiClient.post('/quiz/submit', { attemptId, answers });

export const getProgress = (userId) =>
  apiClient.get(`/progress/${userId}`);

export const sendReminder = (topic, channel = 'email', userId) =>
  apiClient.post('/reminder-trigger', { 
    userId, 
    topic, 
    channel 
  });
