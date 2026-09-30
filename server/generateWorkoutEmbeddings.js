require("dotenv").config();

const mongoose = require("mongoose");
const Workout = require("./models/Workout");
const connectDB = require("./config/db");
const {
  generateWorkoutEmbedding
} = require("./services/embeddingService");

const generateEmbeddings = async () => {
  try {
    await connectDB();

    const workouts = await Workout.find({
      $or: [
        { embedding: { $exists: false } },
        { embedding: { $size: 0 } }
      ]
    });

    console.log(`Found ${workouts.length} workouts without embeddings.`);

    for (const workout of workouts) {
      console.log(
        `Generating embedding for: ${workout.workoutName} (${workout.category})`
      );

      const embedding = await generateWorkoutEmbedding(
        workout.workoutName,
        workout.category
      );

      workout.embedding = embedding;

      await workout.save();

      console.log(
        `Embedding saved successfully for workout: ${workout.workoutName}`
      );
    }

    console.log("Workout embedding generation completed successfully.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Embedding generation failed:");
    console.error(error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

generateEmbeddings();