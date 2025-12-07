import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import dotenv from 'dotenv';
dotenv.config();

export const generateTimetable = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });

    // Initialize Groq model via LangChain
    // Updated to a currently supported model
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile", 
      temperature: 0.2, // Low temperature for consistent JSON structure
    });

    const parser = new JsonOutputParser();

    const systemTemplate = `You are an expert academic study planner. Create a detailed weekly timetable based on the user's request.
    
    Rules:
    1. Identify unavailable hours (college, work, sleep, commute, etc.) from the user's description.
    2. Allocate study slots for requested subjects efficiently.
    3. Include short breaks (15-30 mins) between long sessions.
    4. Ensure the schedule covers Monday to Sunday.
    5. Return ONLY valid JSON matching the structure below. Do not include markdown formatting like \`\`\`json.
    
    JSON Structure:
    {{
      "schedule": [
        {{
          "day": "Monday",
          "slots": [
            {{ "time": "HH:MM - HH:MM", "activity": "Activity Name", "type": "study" }} 
          ]
        }}
      ]
    }}
    
    Allowed types: 'study', 'busy', 'break', 'leisure'.`;

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["user", "{user_input}"],
    ]);

    const chain = promptTemplate.pipe(model).pipe(parser);

    console.log("Generating timetable with LangChain Groq...");
    const timetable = await chain.invoke({
      user_input: prompt,
    });

    res.json({ success: true, timetable });
  } catch (error) {
    console.error("Timetable Gen Error:", error);
    next(error);
  }
};
