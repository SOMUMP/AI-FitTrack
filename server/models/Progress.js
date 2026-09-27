const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    weight: {
      type: Number,
      required: true
    },

    height: {
      type: Number,
      required: true
    },

    bmi: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Progress", progressSchema);