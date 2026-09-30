const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

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

module.exports = {
  generateFitnessRecommendation
};