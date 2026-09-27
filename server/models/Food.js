const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    calories: {
      type: Number,
      required: true
    },

    protein: {
      type: Number,
      required: true
    },

    carbohydrates: {
      type: Number,
      required: true
    },

    fats: {
      type: Number,
      required: true
    },

    servingSize: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Food", foodSchema);