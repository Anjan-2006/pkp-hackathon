import React from 'react';
import { Workflow, Bot, Zap } from 'lucide-react';

export const AutomationPage = () => {
  const handleDailySummaryClick = async () => {
    // Ask user for their email address
    const userEmail = window.prompt("Please enter your email address to receive daily summaries:");

    if (userEmail && userEmail.includes('@')) {
      try {
        // Assuming your backend runs on port 3000
        const response = await fetch('http://localhost:3000/api/automation/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Send the email entered by the user
          body: JSON.stringify({ email: userEmail }),
        });

        if (response.ok) {
          alert(`Success! Daily summaries will be sent to ${userEmail}`);
        } else {
          alert("Failed to subscribe. Please try again.");
        }
      } catch (error) {
        console.error("Subscription error:", error);
        alert("Error connecting to the server.");
      }
    } else if (userEmail !== null) {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <Workflow size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation Hub</h1>
          <p className="text-gray-500">Streamline your learning workflow.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={handleDailySummaryClick}
          className="glass-card p-6 rounded-2xl hover:shadow-lg transition cursor-pointer group"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Bot size={24} />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Daily Summary Generator</h3>
          <p className="text-sm text-gray-500">Automatically generate a summary of your learning progress at the end of the day.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition cursor-pointer group">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Zap size={24} />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Smart Review Scheduler</h3>
          <p className="text-sm text-gray-500">Automate your revision schedule based on your quiz performance.</p>
        </div>
      </div>
    </div>
  );
};
