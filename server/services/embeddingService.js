const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generateWorkoutEmbedding = async (workoutName, category) => {
  const text = `${workoutName}. Category: ${category}`;

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text
  });

  if (
    !response.embeddings ||
    !response.embeddings[0] ||
    !response.embeddings[0].values
  ) {
    throw new Error("Embedding was not generated.");
  }

  return response.embeddings[0].values;
};

module.exports = {
  generateWorkoutEmbedding
};