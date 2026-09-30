const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// =====================================================
// FITNESS RECOMMENDATION
// =====================================================
const generateFitnessRecommendation = async ({
  workoutName,
  category,
  duration,
  caloriesBurned
}) => {
  const prompt = `
You are an AI fitness assistant for the AI FitTrack application.

Analyze the following workout information and provide a short, practical fitness recommendation.

Workout Name: ${workoutName}
Category: ${category}
Duration: ${duration} minutes
Calories Burned: ${caloriesBurned}

Give:
1. A short assessment of the workout.
2. One practical recommendation.
3. One simple safety or recovery tip.

Keep the response clear and beginner-friendly.
Do not make medical diagnoses.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt
  });

  return response.text;
};


// =====================================================
// AI CHAT
// =====================================================
const generateAIChatResponse = async (message) => {
  const prompt = `
You are the AI assistant inside the AI FitTrack fitness application.

Your job is to help users with:
- Workouts
- Exercise
- Fitness
- Calories
- Healthy lifestyle
- Recovery
- Basic nutrition
- Fitness goals

User message:
${message}

Instructions:
1. Give a clear and beginner-friendly answer.
2. Keep the answer practical.
3. Do not make medical diagnoses.
4. Do not claim to replace a doctor or healthcare professional.
5. If the question is unrelated to fitness, politely say that you mainly help with fitness and healthy lifestyle topics.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt
  });

  return response.text;
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
  generateFitnessRecommendation,
  generateAIChatResponse
};