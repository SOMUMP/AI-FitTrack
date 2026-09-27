const express = require("express");

const {
  addProgress,
  getProgress,
  updateProgress,
  deleteProgress
} = require("../controllers/progressController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Add Progress
router.post("/add", authMiddleware, addProgress);

// Get User Progress
router.get("/", authMiddleware, getProgress);

// Update Progress
router.put("/:id", authMiddleware, updateProgress);

// Delete Progress
router.delete("/:id", authMiddleware, deleteProgress);

module.exports = router;