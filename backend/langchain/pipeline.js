import { ChatGroq } from '@langchain/groq';
import { generateLearningPrompt, generateQuizPrompt } from './prompts.js';

let model;

const initModel = () => {
  if (!model) {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_groq_key')) {
      console.warn("⚠️ Invalid or missing GROQ_API_KEY. Switching to MOCK mode.");
      return null;
    }
    
    model = new ChatGroq({
      apiKey: apiKey,
      model: 'llama-3.3-70b-versatile', // Updated to latest supported model
      temperature: 0.5,
    });
  }
  return model;
};

export const generateLearningContent = async (topic, confidenceLevel, goal) => {
  try {
    const llm = initModel();
    
    if (!llm) {
      return getMockData(topic, goal);
    }

    const prompt = generateLearningPrompt(topic, confidenceLevel, goal);
    const response = await llm.invoke(prompt);
    
    const content = response.content;
    // Extract JSON from potential markdown code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('Invalid LangChain response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('LangChain pipeline error:', error);
    
    // Fallback for API errors
    if (error.status === 401 || (error.message && error.message.includes('401'))) {
      console.warn("⚠️ Groq API Key rejected. Falling back to MOCK data.");
      return getMockData(topic, goal);
    }
    
    throw error;
  }
};

export const generateChatResponse = async (message, topic, mode, history) => {
  try {
    const llm = initModel();
    if (!llm) {
      // Mock response if no API key
      return `(Mock ${mode} mode) I received: "${message}". Since I'm in mock mode, I can't generate a real AI response, but in a real scenario, I would act as your ${mode} mentor for ${topic}.`;
    }

    let systemPrompt = `You are an expert AI tutor specializing in ${topic}. `;
    
    if (mode === 'learn') {
      systemPrompt += "Your goal is to explain concepts clearly, use analogies, and ensure the student understands. Keep responses concise, friendly, and encouraging. Use formatting like bolding and bullet points for readability.";
    } else if (mode === 'practice') {
      systemPrompt += "Your goal is to test the student's knowledge. Ask short, specific challenge questions one by one. Evaluate their response as CLEAR, PARTIAL, or CONFUSED, provide brief feedback, and then ask the next logical question.";
    } else if (mode === 'interview') {
      systemPrompt += "You are a technical interviewer at a top tech company. Maintain a professional yet supportive tone. Ask progressive follow-up questions (DSA/System Design/etc). If the user struggles, provide subtle hints. If they answer well, dig deeper into edge cases.";
    }

    // Simple history context construction
    const conversation = history.map(m => `${m.sender === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n');
    
    const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversation}\n\nStudent: ${message}\nTutor:`;

    const response = await llm.invoke(fullPrompt);
    return response.content;
  } catch (error) {
    console.error("Chat Error", error);
    return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
  }
};

// NEW: Generate custom quiz
export const generateCustomQuiz = async (topic, config) => {
  try {
    const llm = initModel();
    if (!llm) {
      // Mock data fallback
      return {
        quiz: Array(Number(config.numQuestions)).fill(0).map((_, i) => ({
          question: `(Mock) ${config.difficulty} question ${i + 1} about ${topic} (${config.style})`,
          options: ["Answer A", "Answer B", "Answer C", "Answer D"],
          correct: 0
        }))
      };
    }

    const prompt = generateQuizPrompt(topic, config);
    const response = await llm.invoke(prompt);
    
    const content = response.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('Invalid LangChain response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    throw error;
  }
};

const getMockData = async (topic, goal) => {
  console.log("Generating MOCK content...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    explanation: `(Mock Mode) Here is a generated explanation for ${topic}. Since no valid Groq API key was found, this is a placeholder text.`,
    example: `(Mock Mode) A real-world example of ${topic} applied to ${goal}.`,
    quiz: [
      { question: `What is the main benefit of ${topic}?`, options: ["Efficiency", "Complexity", "Confusion", "Nothing"], correct: 0 },
      { question: "Which scenario fits best?", options: ["Scenario A", "Scenario B", "Scenario C", "Scenario D"], correct: 1 },
      { question: "True or False?", options: ["True", "False"], correct: 0 }
    ]
  };
};
