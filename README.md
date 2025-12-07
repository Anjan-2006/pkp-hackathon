# EduLink AI 🚀

EduLink AI is an intelligent learning management platform designed to streamline your educational journey. It leverages AI to generate personalized learning content, timetables, and provides automated daily summaries of your progress via email.

## ✨ Features

*   **🤖 AI-Powered Learning**: Utilizes Groq (Llama 3) to generate study materials and personalized timetables.
*   **📹 Video Integration**: Seamlessly searches and integrates relevant educational videos using the YouTube Data API.
*   **🔐 Secure Authentication**: Google OAuth integration for secure and easy user login.
*   **📧 Automation Hub**:
    *   **Daily Summary Generator**: Automatically sends a daily email report at **9:30 AM** containing your learning statistics (Topics covered, Quizzes taken, Average score).
    *   **Smart Review Scheduler**: Helps automate revision schedules based on performance.
*   **📊 Progress Tracking**: Tracks quiz results and user performance over time using MongoDB.

## 🛠️ Tech Stack

*   **Frontend**: React, Tailwind CSS, Lucide React (Icons)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **AI & APIs**: Groq SDK (Llama 3), YouTube Data API, Google OAuth 2.0
*   **Automation**: Nodemailer (Email services), Node-cron (Job scheduling)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Google Cloud Console Project (for OAuth & YouTube API)
*   Groq API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd edulink-ai
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/edulink-ai

# Groq API Key (Llama 3)
GROQ_API_KEY=your_groq_api_key

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# YouTube Data API Key
YOUTUBE_API_KEY=your_youtube_api_key

# Email Configuration (For Automation)
EMAIL_USER=dmohanvenkatshankar@gmail.com
EMAIL_PASS=your_app_specific_password

# Server Config
PORT=3000
SESSION_SECRET=your_session_secret
```

### Running the Application

1.  **Start the Backend**
    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the Frontend**
    ```bash
    cd frontend
    npm run dev
    ```

## 📧 Automation Feature

The **Automation Hub** allows users to subscribe to daily progress reports.

1.  Navigate to the **Automation Hub** page in the frontend.
2.  Click on **Daily Summary Generator**.
3.  Enter the email address associated with your account.
4.  The system will send a confirmation email immediately.
5.  Every day at **9:18 AM**, the system runs a cron job to calculate your learning stats (fetching data from the `QuizResult` collection linked to your account) and emails you a detailed HTML report.

## 📂 Project Structure

```
edulink-ai/
├── backend/
│   ├── config/         # Database & Passport config
│   ├── models/         # Mongoose Models (User, QuizResult, AutomationEmail)
│   ├── routes/         # API Routes (auth, learning, automationRoutes)
│   ├── server.js       # Entry point
│   └── .env            # Environment variables
└── frontend/
    ├── src/
    │   ├── pages/      # React Pages (AutomationPage, etc.)
    │   └── ...
    └── ...
```
