const {
  generateFitnessRecommendation
} = require("../services/geminiService");

const getFitnessRecommendation = async (req, res) => {
  try {
    const {
      workoutName,
      category,
      duration,
      caloriesBurned
    } = req.body;

    if (
      !workoutName ||
      !category ||
      duration === undefined ||
      caloriesBurned === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "workoutName, category, duration and caloriesBurned are required"
      });
    }

    const recommendation = await generateFitnessRecommendation({
      workoutName,
      category,
      duration,
      caloriesBurned
    });

    return res.status(200).json({
      success: true,
      message: "AI fitness recommendation generated successfully",
      workout: {
        workoutName,
        category,
        duration,
        caloriesBurned
      },
      recommendation
    });
  } catch (error) {
    console.error("AI recommendation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI fitness recommendation",
      error: error.message
    });
  }
};

module.exports = {
  getFitnessRecommendation
};