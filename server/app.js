const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple Test Route
app.get("/test", (req, res) => {
  res.json({
    message: "Test route is working"
  });
});

// Authentication Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Workout Routes
const workoutRoutes = require("./routes/workoutRoutes");
app.use("/api/workouts", workoutRoutes);

// Food Routes
const foodRoutes = require("./routes/foodRoutes");
app.use("/api/foods", foodRoutes);

// Progress Routes
const progressRoutes = require("./routes/progressRoutes");
app.use("/api/progress", progressRoutes);

// Recommendation Routes
const recommendationRoutes = require("./routes/recommendationRoutes");
app.use("/api/recommendations", recommendationRoutes);

// Dashboard Routes
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "AI FitTrack API is running"
  });
});

module.exports = app;