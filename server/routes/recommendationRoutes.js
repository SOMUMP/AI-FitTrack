const express = require("express");

const {
  addRecommendation,
  getRecommendations,
  generateAIRecommendation,
  deleteRecommendation
} = require("../controllers/recommendationController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Add Manual Recommendation
router.post("/add", authMiddleware, addRecommendation);

// Generate AI Recommendation
router.post("/generate", authMiddleware, generateAIRecommendation);

// Get User Recommendations
router.get("/", authMiddleware, getRecommendations);

// Delete Recommendation
router.delete("/:id", authMiddleware, deleteRecommendation);

module.exports = router;