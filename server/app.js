const express = require("express");
const cors = require("cors");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Simple Test Route
// ===============================
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test route is working"
  });
});

// ===============================
// Authentication Routes
// ===============================
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ===============================
// Workout Routes
// ===============================
const workoutRoutes = require("./routes/workoutRoutes");
app.use("/api/workouts", workoutRoutes);

// ===============================
// Food Routes
// ===============================
const foodRoutes = require("./routes/foodRoutes");
app.use("/api/foods", foodRoutes);

// ===============================
// Progress Routes
// ===============================
const progressRoutes = require("./routes/progressRoutes");
app.use("/api/progress", progressRoutes);

// ===============================
// Recommendation Routes
// ===============================
const recommendationRoutes = require("./routes/recommendationRoutes");
app.use("/api/recommendations", recommendationRoutes);

// ===============================
// Dashboard Routes
// ===============================
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// ===============================
// Vector Search Routes
// ===============================
const vectorSearchRoutes = require("./routes/vectorSearchRoutes");
app.use("/api/vector-search", vectorSearchRoutes);

// ===============================
// AI Routes
// ===============================
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

// ===============================
// Admin Routes
// ===============================
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

console.log("Admin routes mounted successfully");

// ===============================
// Document Routes
// ===============================
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/documents", documentRoutes);

console.log("Document routes mounted successfully");

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI FitTrack API is running"
  });
});

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;