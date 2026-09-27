const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    recommendation: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["workout", "diet", "general"],
      default: "general"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Recommendation",
  recommendationSchema
);