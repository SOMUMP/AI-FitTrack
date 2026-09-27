const Workout = require("../models/Workout");
const Food = require("../models/Food");
const Progress = require("../models/Progress");
const Recommendation = require("../models/Recommendation");

// Get Dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user workouts
    const workouts = await Workout.find({
      user: userId
    });

    // Total workouts
    const totalWorkouts = workouts.length;

    // Total calories burned
    const totalCaloriesBurned = workouts.reduce(
      (total, workout) =>
        total + Number(workout.caloriesBurned || 0),
      0
    );

    // Get latest progress
    const latestProgress = await Progress.findOne({
      user: userId
    }).sort({ date: -1 });

    // Get total foods
    const totalFoods = await Food.countDocuments();

    // Get latest recommendation
    const latestRecommendation = await Recommendation.findOne({
      user: userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Dashboard data fetched successfully",

      dashboard: {
        totalWorkouts,
        totalCaloriesBurned,
        totalFoods,

        latestProgress: latestProgress
          ? {
              weight: latestProgress.weight,
              height: latestProgress.height,
              bmi: latestProgress.bmi,
              date: latestProgress.date
            }
          : null,

        latestRecommendation: latestRecommendation
          ? {
              recommendation: latestRecommendation.recommendation,
              type: latestRecommendation.type,
              createdAt: latestRecommendation.createdAt
            }
          : null
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getDashboard
};