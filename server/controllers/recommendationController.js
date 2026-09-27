const Recommendation = require("../models/Recommendation");
const Workout = require("../models/Workout");
const Progress = require("../models/Progress");
const { generateRecommendation } = require("../services/aiRecommendation");

// Add Manual Recommendation
const addRecommendation = async (req, res) => {
  try {
    const {
      recommendation,
      type
    } = req.body;

    if (!recommendation) {
      return res.status(400).json({
        message: "Please provide recommendation"
      });
    }

    const newRecommendation = await Recommendation.create({
      user: req.user.userId,
      recommendation,
      type: type || "general"
    });

    res.status(201).json({
      message: "Recommendation added successfully",
      recommendation: newRecommendation
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get User Recommendations
const getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      user: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Recommendations fetched successfully",
      recommendations
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Generate AI Recommendation
const generateAIRecommendation = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get latest progress
    const latestProgress = await Progress.findOne({
      user: userId
    }).sort({ date: -1 });

    if (!latestProgress) {
      return res.status(400).json({
        message: "Please add your progress data first"
      });
    }

    // Get user workouts
    const workouts = await Workout.find({
      user: userId
    });

    const workoutCount = workouts.length;

    const totalCaloriesBurned = workouts.reduce(
      (total, workout) =>
        total + Number(workout.caloriesBurned || 0),
      0
    );

    // Generate recommendation
    const recommendationText = generateRecommendation({
      weight: latestProgress.weight,
      height: latestProgress.height,
      bmi: latestProgress.bmi,
      workoutCount,
      totalCaloriesBurned
    });

    // Save recommendation
    const recommendation = await Recommendation.create({
      user: userId,
      recommendation: recommendationText,
      type: "general"
    });

    res.status(201).json({
      message: "AI recommendation generated successfully",
      recommendation,
      summary: {
        weight: latestProgress.weight,
        height: latestProgress.height,
        bmi: latestProgress.bmi,
        workoutCount,
        totalCaloriesBurned
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete Recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!recommendation) {
      return res.status(404).json({
        message: "Recommendation not found"
      });
    }

    res.status(200).json({
      message: "Recommendation deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  addRecommendation,
  getRecommendations,
  generateAIRecommendation,
  deleteRecommendation
};