const Progress = require("../models/Progress");

// Add Progress
const addProgress = async (req, res) => {
  try {
    const {
      weight,
      height,
      bmi,
      date
    } = req.body;

    if (
      weight === undefined ||
      height === undefined ||
      bmi === undefined ||
      !date
    ) {
      return res.status(400).json({
        message: "Please provide all progress details"
      });
    }

    const progress = await Progress.create({
      user: req.user.userId,
      weight,
      height,
      bmi,
      date
    });

    res.status(201).json({
      message: "Progress added successfully",
      progress
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get User Progress
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      user: req.user.userId
    }).sort({ date: -1 });

    res.status(200).json({
      message: "Progress fetched successfully",
      progress
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update Progress
const updateProgress = async (req, res) => {
  try {
    const {
      weight,
      height,
      bmi,
      date
    } = req.body;

    const progress = await Progress.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },
      {
        weight,
        height,
        bmi,
        date
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found"
      });
    }

    res.status(200).json({
      message: "Progress updated successfully",
      progress
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete Progress
const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found"
      });
    }

    res.status(200).json({
      message: "Progress deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  addProgress,
  getProgress,
  updateProgress,
  deleteProgress
};