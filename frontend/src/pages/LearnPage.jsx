import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Sparkles, BookOpen, BrainCircuit, Briefcase, FileText, Zap } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { sendChatMessage, fetchLastSession } from '../services/api'; // Import fetchLastSession

// Helper component to format AI text (Bold and Lists)
const FormattedMessage = ({ text }) => {
  if (!text) return null;

  // Split by newlines to handle paragraphs and lists
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        // Handle Bullet Points (* Item)
        if (line.trim().startsWith('* ')) {
          const content = line.trim().substring(2);
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-indigo-500 mt-1.5">•</span>
              <p dangerouslySetInnerHTML={{ 
                __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
              }} />
            </div>
          );
        }
        // Handle Standard Text with Bold (**Text**)
        return (
          <p key={i} dangerouslySetInnerHTML={{ 
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }} />
        );
      })}
    </div>
  );
};

export const LearnPage = () => {
  const { currentSession, startSession } = useLearning(); // Get startSession to update context
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('learn'); // learn, practice, interview
  const scrollRef = useRef(null);

  // Initialize chat with session context
  useEffect(() => {
    if (currentSession?.content && messages.length === 0) {
      // Check if we have history from DB (if restored session)
      if (currentSession.chatHistory && currentSession.chatHistory.length > 0) {
        setMessages(currentSession.chatHistory.map(m => ({
          id: m._id || Date.now() + Math.random(),
          sender: m.sender,
          text: m.text
        })));
      } else {
        // Default welcome message
        setMessages([
          {
            id: 'init',
            sender: 'ai',
            text: `Hi! I'm your AI mentor for **${currentSession.topic}**.\n\nI've analyzed your goal: *${currentSession.goal}*.\n\nHere's a quick summary to start:\n${currentSession.content.explanation}\n\nWhat would you like to do next? We can dive deeper, practice questions, or simulate an interview.`
          }
        ]);
      }
    }
  }, [currentSession]);

  // NEW: Fetch latest history on mount to ensure persistence
  useEffect(() => {
    const loadHistory = async () => {
      if (currentSession?.attemptId) {
        // If we have an attempt ID, let's try to fetch the latest state of it
        // This is a bit of a hack using fetchLastSession, ideally we'd have getSessionById
        // But since we are usually working on the last session, this works.
        // Or we rely on what was passed in context if it was just loaded.
        
        if (currentSession.chatHistory && currentSession.chatHistory.length > 0) {
             const formattedHistory = currentSession.chatHistory.map(m => ({
              id: m._id || Date.now() + Math.random(),
              sender: m.sender,
              text: m.text
            }));
            setMessages(formattedHistory);
        } else if (messages.length === 0) {
             // Default welcome message if no history exists
            setMessages([
              {
                id: 'init',
                sender: 'ai',
                text: `Hi! I'm your AI mentor for **${currentSession.topic}**.\n\nI've analyzed your goal: *${currentSession.goal}*.\n\nHere's a quick summary to start:\n${currentSession.content?.explanation || ''}\n\nWhat would you like to do next? We can dive deeper, practice questions, or simulate an interview.`
              }
            ]);
        }
      }
    };
    loadHistory();
  }, [currentSession]); // Depend on currentSession

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for context (last 6 messages)
      const history = messages.slice(-6).map(m => ({ sender: m.sender, text: m.text }));
      
      // Pass attemptId to sendChatMessage
      const res = await sendChatMessage(text, currentSession.topic, mode, history, currentSession.attemptId);
      
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: res.data.reply };
      setMessages(prev => [...prev, aiMsg]);

      // Update context with new history so it persists if we navigate away and back
      // We construct the new history array
      const newHistory = [
          ...(currentSession.chatHistory || []),
          { sender: 'user', text: text, timestamp: new Date() },
          { sender: 'ai', text: res.data.reply, timestamp: new Date() }
      ];
      
      // Update the session in context locally
      startSession(
          { topic: currentSession.topic, confidence: currentSession.confidence, goal: currentSession.goal },
          currentSession.content,
          currentSession.attemptId
      );
      // Manually patch the chatHistory into the currentSession object in context
      // (Since startSession might not accept chatHistory directly depending on implementation, 
      // but usually we pass the whole object. Let's assume we need to refresh it).
      currentSession.chatHistory = newHistory;

    } catch (error) {
      console.error(error);
      const errorMsg = { id: Date.now() + 1, sender: 'ai', text: "I'm having trouble connecting right now. Please try again." };
      setMessages(prev => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  const handleQuickAction = (actionText) => {
    handleSend(actionText);
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    const modeMsg = { 
      id: Date.now(), 
      sender: 'system', 
      text: `Switched to ${newMode.toUpperCase()} mode.` 
    };
    setMessages(prev => [...prev, modeMsg]);
    
    if (newMode === 'interview') {
      handleSend("I'm ready for a mock interview. Start with a basic question.");
    } else if (newMode === 'practice') {
      handleSend("Give me a practice question to test my understanding.");
    }
  };

  if (!currentSession.topic) return <div className="p-10 text-center">Please start a topic from the Dashboard.</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 border-b border-gray-100 flex justify-between items-center z-10">
        <div>
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Bot className="text-indigo-600" /> {currentSession.topic}
          </h2>
          <p className="text-xs text-gray-500 capitalize font-medium">Mode: <span className="text-indigo-600">{mode}</span></p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleMode('learn')}
            className={`p-2 rounded-lg transition ${mode === 'learn' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Learn Mode"
          >
            <BookOpen size={20} />
          </button>
          <button 
            onClick={() => toggleMode('practice')}
            className={`p-2 rounded-lg transition ${mode === 'practice' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Practice Mode"
          >
            <BrainCircuit size={20} />
          </button>
          <button 
            onClick={() => toggleMode('interview')}
            className={`p-2 rounded-lg transition ${mode === 'interview' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Interview Mode"
          >
            <Briefcase size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white/50 to-transparent">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} ${msg.sender === 'system' ? 'justify-center' : ''}`}
          >
            {msg.sender === 'system' ? (
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{msg.text}</span>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {/* Use FormattedMessage for AI, simple text for User */}
                  {msg.sender === 'ai' ? <FormattedMessage text={msg.text} /> : msg.text}
                </div>
              </>
            )}
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-2 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { label: 'Summarize', icon: FileText },
          { label: 'Explain Like I\'m 5', icon: Sparkles },
          { label: 'Real Example', icon: Zap },
          { label: 'Practice Question', icon: BrainCircuit },
          { label: 'Interview Me', icon: Briefcase },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action.label)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition whitespace-nowrap shadow-sm"
          >
            <action.icon size={12} /> {action.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={mode === 'interview' ? "Answer the interviewer..." : "Ask a question or type a topic..."}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
