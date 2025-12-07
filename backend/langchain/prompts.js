export const generateLearningPrompt = (topic, confidenceLevel, goal) => {
  const difficulty = confidenceLevel <= 2 ? 'beginner' : confidenceLevel === 3 ? 'intermediate' : 'advanced';
  
  return `You are an expert educational tutor. Generate learning content with this exact JSON structure:
  
Topic: ${topic}
Difficulty Level: ${difficulty}
Learning Goal: ${goal}

Return ONLY valid JSON (no markdown, no extra text):
{
  "explanation": "A clear, ${difficulty}-level explanation of ${topic} (2-3 sentences)",
  "example": "A real-world example relevant to ${goal}",
  "quiz": [] 
}`;
};

// NEW: Prompt for custom quiz generation
export const generateQuizPrompt = (topic, config) => {
  const { difficulty, numQuestions, style, includeTrick, includeTrueFalse } = config;
  
  return `Generate a ${difficulty} level quiz about "${topic}".
  
Configuration:
- Number of questions: ${numQuestions}
- Style: ${style} (Direct = concept recall, Scenario = application/interview style)
- Include Trick Questions: ${includeTrick}
- Include True/False: ${includeTrueFalse}

Return ONLY valid JSON with this structure:
{
  "quiz": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation of why the correct answer is correct."
    }
  ]
}`;
};
