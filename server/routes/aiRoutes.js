const express = require("express");

const {
  getFitnessRecommendation,
  chatWithAI,
  getChatHistory,
  deleteChatHistory
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();


// ==========================================
// AI FITNESS RECOMMENDATION
// ==========================================

router.post(
  "/recommendation",
  authMiddleware,
  getFitnessRecommendation
);


// ==========================================
// AI CHAT
// ==========================================

router.post(
  "/chat",
  authMiddleware,
  chatWithAI
);


// ==========================================
// CHAT HISTORY - GET
// ==========================================

router.get(
  "/chat/history",
  authMiddleware,
  getChatHistory
);


// ==========================================
// CHAT HISTORY - DELETE
// ==========================================

router.delete(
  "/chat/history",
  authMiddleware,
  deleteChatHistory
);


module.exports = router;