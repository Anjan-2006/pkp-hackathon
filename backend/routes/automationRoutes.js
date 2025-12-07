import express from 'express';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import AutomationEmail from '../models/AutomationEmail.js';
import User from '../models/User.js'; // Import User model
import QuizResult from '../models/QuizResult.js'; // Import QuizResult model (Ensure this exists)

const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to calculate stats for a specific email
const getUserStats = async (email) => {
  try {
    // 1. Find the user account associated with this email
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return { topics: 0, quizzes: 0, score: 'N/A (User not found)' };
    }

    // 2. Find quiz results for this user
    // Assuming QuizResult has a 'user' field referencing the User ID
    const results = await QuizResult.find({ user: user._id });

    if (results.length === 0) {
      return { topics: 0, quizzes: 0, score: '0%' };
    }

    // 3. Calculate Stats
    const totalQuizzes = results.length;
    
    // Count unique topics
    const uniqueTopics = new Set(results.map(r => r.topic)).size;
    
    // Calculate Average Score
    const totalScore = results.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const avgScore = Math.round(totalScore / totalQuizzes);

    return {
      topics: uniqueTopics,
      quizzes: totalQuizzes,
      score: `${avgScore}%`
    };

  } catch (error) {
    console.error(`Error calculating stats for ${email}:`, error);
    return { topics: 0, quizzes: 0, score: 'Error' };
  }
};

// HTML Email Template with Dynamic Stats
const getEmailTemplate = (email, stats) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .greeting { color: #1f2937; font-size: 22px; text-align: center; margin-bottom: 20px; font-weight: bold; }
        .highlight { color: #4f46e5; text-decoration: none; }
        .stats-box { background-color: #f9fafb; border-radius: 12px; padding: 25px; margin: 0 auto 30px auto; max-width: 80%; }
        .stat-item { margin-bottom: 15px; font-size: 16px; color: #374151; display: flex; align-items: center; gap: 10px; }
        .score { color: #ef4444; font-weight: bold; }
        .cta-button { background-color: #4f46e5; color: #ffffff !important; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
           <h1 style="color: #4f46e5; margin: 0;">EduLink AI</h1>
        </div>
        
        <div class="greeting">
          Good Morning, <a href="mailto:${email}" class="highlight">${email}</a>! ☀️
        </div>
        
        <p style="color: #6b7280; text-align: center; margin-bottom: 30px;">Here is the analysis of your account progress:</p>
        
        <div class="stats-box">
          <div class="stat-item">
            <span>📚</span> <strong>Total Topics:</strong> ${stats.topics}
          </div>
          <div class="stat-item">
            <span>📝</span> <strong>Quizzes Taken:</strong> ${stats.quizzes}
          </div>
          <div class="stat-item">
            <span>🎯</span> <strong>Average Score:</strong> <span class="score">${stats.score}</span>
          </div>
        </div>
        
        <div style="text-align: center;">
          <p style="color: #6b7280; margin-bottom: 20px;">Ready to improve your stats?</p>
          <a href="http://localhost:5173" class="cta-button">Start Learning</a>
        </div>
        
        <div class="footer">
          To unsubscribe, please visit your Automation Hub settings.
        </div>
      </div>
    </body>
    </html>
  `;
};

// Helper function to send email
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"EduLink AI" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Route to subscribe to daily summaries
router.post('/subscribe', async (req, res) => {
  const userEmail = req.body.email;

  if (!userEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existing = await AutomationEmail.findOne({ email: userEmail });
    if (existing) {
      return res.status(200).json({ message: 'Already subscribed' });
    }

    await AutomationEmail.create({ email: userEmail });

    // Fetch REAL stats for the welcome email
    const stats = await getUserStats(userEmail);

    await sendEmail(
      userEmail,
      'EduLink AI - Subscription Confirmed',
      getEmailTemplate(userEmail, stats)
    );

    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Schedule Daily Email at 9:30 AM
cron.schedule('30 9 * * *', async () => {
  console.log('Running daily summary job...');
  
  try {
    const subscribers = await AutomationEmail.find({});
    
    for (const sub of subscribers) {
      // Fetch REAL stats for each subscriber
      const stats = await getUserStats(sub.email);

      await sendEmail(
        sub.email,
        'EduLink AI - Your Daily Learning Analysis',
        getEmailTemplate(sub.email, stats)
      );
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});

export default router;
