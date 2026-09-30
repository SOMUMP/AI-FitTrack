const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    workoutName: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    duration: {
      type: Number,
      required: true
    },

    caloriesBurned: {
      type: Number,
      required: true
    },

    workoutDate: {
      type: Date,
      required: true
    },

    embedding: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Workout", workoutSchema);