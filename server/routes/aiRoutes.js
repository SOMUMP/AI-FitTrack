const express = require("express");

const {
  getFitnessRecommendation
} = require("../controllers/aiController");

const router = express.Router();

router.post("/recommendation", getFitnessRecommendation);

module.exports = router;