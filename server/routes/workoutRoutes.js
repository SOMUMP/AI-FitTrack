const express = require("express");

const {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  searchWorkout
} = require("../controllers/workoutController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Add Workout
router.post("/add", authMiddleware, addWorkout);

// Get All User Workouts
router.get("/", authMiddleware, getWorkouts);

// Search Workout
router.get("/search", authMiddleware, searchWorkout);

// Update Workout
router.put("/:id", authMiddleware, updateWorkout);

// Delete Workout
router.delete("/:id", authMiddleware, deleteWorkout);

module.exports = router;