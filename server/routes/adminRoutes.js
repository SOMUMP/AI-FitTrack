const express = require("express");

const User = require("../models/User");
const Workout = require("../models/Workout");
const Food = require("../models/Food");
const Progress = require("../models/Progress");

const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

const router = express.Router();

// ==========================================
// ADMIN TEST ROUTE
// ==========================================
router.get(
  "/test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted successfully",
      user: {
        userId: req.user.userId,
        role: req.user.role
      }
    });
  }
);

// ==========================================
// GET ALL USERS - ADMIN ONLY
// ==========================================
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        count: users.length,
        users: users
      });

    } catch (error) {
      console.error("Error fetching users:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch users"
      });
    }
  }
);

// ==========================================
// DELETE USER - ADMIN ONLY
// ==========================================
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const userId = req.params.id;

      if (userId === req.user.userId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Admin cannot delete their own account"
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      await User.findByIdAndDelete(userId);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        deletedUser: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error("Error deleting user:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete user"
      });
    }
  }
);

// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalWorkouts = await Workout.countDocuments();
      const totalFoods = await Food.countDocuments();
      const totalProgress = await Progress.countDocuments();

      res.status(200).json({
        success: true,
        message: "Admin dashboard data fetched successfully",
        statistics: {
          totalUsers,
          totalWorkouts,
          totalFoods,
          totalProgress
        }
      });

    } catch (error) {
      console.error("Error fetching admin dashboard:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch admin dashboard data"
      });
    }
  }
);

module.exports = router;