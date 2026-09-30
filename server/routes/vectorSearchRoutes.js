const express = require("express");

const router = express.Router();

const {
  vectorSearchWorkouts
} = require("../controllers/vectorSearchController");

router.post("/search", vectorSearchWorkouts);

module.exports = router;