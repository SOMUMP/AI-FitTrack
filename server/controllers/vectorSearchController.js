const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const vectorSearchWorkouts = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: query
    });

    const queryVector = embeddingResponse.embeddings[0].values;

    const results = await mongoose.connection
      .collection("workouts")
      .aggregate([
        {
          $vectorSearch: {
            index: "workoutVectorIndex",
            path: "embedding",
            queryVector: queryVector,
            numCandidates: 100,
            limit: 5
          }
        },
        {
          $project: {
            _id: 1,
            workoutName: 1,
            category: 1,
            duration: 1,
            caloriesBurned: 1,
            workoutDate: 1,
            score: {
              $meta: "vectorSearchScore"
            }
          }
        }
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Vector search completed successfully",
      query: query,
      count: results.length,
      results: results
    });
  } catch (error) {
    console.error("Vector search error:", error);

    return res.status(500).json({
      success: false,
      message: "Vector search failed",
      error: error.message
    });
  }
};

module.exports = {
  vectorSearchWorkouts
};