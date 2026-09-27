const express = require("express");

const {
  addFood,
  getFoods,
  searchFood,
  updateFood,
  deleteFood
} = require("../controllers/foodController");

const router = express.Router();

// Add Food
router.post("/add", addFood);

// Get All Foods
router.get("/", getFoods);

// Search Food
router.get("/search", searchFood);

// Update Food
router.put("/:id", updateFood);

// Delete Food
router.delete("/:id", deleteFood);

module.exports = router;