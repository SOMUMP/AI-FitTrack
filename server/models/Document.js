const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fileName: {
      type: String,
      required: true,
      trim: true
    },

    fileType: {
      type: String,
      required: true,
      trim: true
    },

    filePath: {
      type: String,
      required: true,
      trim: true
    },

    extractedText: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["uploaded", "processed", "failed"],
      default: "uploaded"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Document", documentSchema);