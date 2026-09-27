const Food = require("../models/Food");

// Add Food
const addFood = async (req, res) => {
  try {
    const {
      name,
      calories,
      protein,
      carbohydrates,
      fats,
      servingSize
    } = req.body;

    if (
      !name ||
      calories === undefined ||
      protein === undefined ||
      carbohydrates === undefined ||
      fats === undefined ||
      !servingSize
    ) {
      return res.status(400).json({
        message: "Please provide all food details"
      });
    }

    const food = await Food.create({
      name,
      calories,
      protein,
      carbohydrates,
      fats,
      servingSize
    });

    res.status(201).json({
      message: "Food added successfully",
      food
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get All Foods
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ name: 1 });

    res.status(200).json({
      message: "Foods fetched successfully",
      foods
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Search Food
const searchFood = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Please provide food name"
      });
    }

    const foods = await Food.find({
      name: {
        $regex: name,
        $options: "i"
      }
    });

    res.status(200).json({
      message: "Food search successful",
      foods
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update Food
const updateFood = async (req, res) => {
  try {
    const {
      name,
      calories,
      protein,
      carbohydrates,
      fats,
      servingSize
    } = req.body;

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name,
        calories,
        protein,
        carbohydrates,
        fats,
        servingSize
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    res.status(200).json({
      message: "Food updated successfully",
      food
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete Food
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    res.status(200).json({
      message: "Food deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  addFood,
  getFoods,
  searchFood,
  updateFood,
  deleteFood
};