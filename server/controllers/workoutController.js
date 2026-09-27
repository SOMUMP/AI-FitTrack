const Workout = require("../models/Workout");

// Add Workout
const addWorkout = async (req, res) => {
  try {
    const {
      workoutName,
      category,
      duration,
      caloriesBurned,
      workoutDate
    } = req.body;

    if (
      !workoutName ||
      !category ||
      !duration ||
      !caloriesBurned ||
      !workoutDate
    ) {
      return res.status(400).json({
        message: "Please provide all workout details"
      });
    }

    const workout = await Workout.create({
      user: req.user.userId,
      workoutName,
      category,
      duration,
      caloriesBurned,
      workoutDate
    });

    res.status(201).json({
      message: "Workout added successfully",
      workout
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get User Workouts
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.user.userId
    }).sort({ workoutDate: -1 });

    res.status(200).json({
      message: "Workouts fetched successfully",
      workouts
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update Workout
const updateWorkout = async (req, res) => {
  try {
    const {
      workoutName,
      category,
      duration,
      caloriesBurned,
      workoutDate
    } = req.body;

    const workout = await Workout.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },
      {
        workoutName,
        category,
        duration,
        caloriesBurned,
        workoutDate
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found"
      });
    }

    res.status(200).json({
      message: "Workout updated successfully",
      workout
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete Workout
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found"
      });
    }

    res.status(200).json({
      message: "Workout deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Search Workout
const searchWorkout = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Please provide workout name"
      });
    }

    const workouts = await Workout.find({
      user: req.user.userId,
      workoutName: {
        $regex: name,
        $options: "i"
      }
    });

    res.status(200).json({
      message: "Workout search successful",
      workouts
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Export functions
module.exports = {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  searchWorkout
};