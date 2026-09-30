require("dotenv").config();

const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");
const connectDB = require("./config/db");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const testVectorSearch = async () => {
  try {
    await connectDB();

    const queryText = "cardio running workout";

    console.log(`Searching for: ${queryText}`);

    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: queryText
    });

    const queryVector = embeddingResponse.embeddings[0].values;

    console.log(
      `Query embedding generated: ${queryVector.length} dimensions`
    );

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

    console.log("\nVector Search Results:");
    console.log(JSON.stringify(results, null, 2));

    await mongoose.connection.close();

    console.log("\nVector Search test completed successfully.");
  } catch (error) {
    console.error("\nVector Search test failed:");
    console.error(error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

testVectorSearch();