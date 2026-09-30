const {
  generateFitnessRecommendation,
  generateAIChatResponse
} = require("../services/geminiService");

const Chat = require("../models/chat");

// =====================================================
// AI FITNESS RECOMMENDATION
// =====================================================

const getFitnessRecommendation = async (req, res) => {
  try {
    const {
      workoutName,
      category,
      duration,
      caloriesBurned
    } = req.body;

    if (
      !workoutName ||
      !category ||
      duration === undefined ||
      caloriesBurned === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "workoutName, category, duration and caloriesBurned are required"
      });
    }

    const recommendation = await generateFitnessRecommendation({
      workoutName,
      category,
      duration,
      caloriesBurned
    });

    return res.status(200).json({
      success: true,
      message: "AI fitness recommendation generated successfully",
      workout: {
        workoutName,
        category,
        duration,
        caloriesBurned
      },
      recommendation
    });
  } catch (error) {
    console.error("AI recommendation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI fitness recommendation",
      error: error.message
    });
  }
};


// =====================================================
// AI CHAT
// =====================================================

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const reply = await generateAIChatResponse(message);

    const chat = await Chat.create({
      userId: req.user.userId,
      userMessage: message,
      aiReply: reply
    });

    return res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      userMessage: message,
      reply: reply,
      chatId: chat._id
    });
  } catch (error) {
    console.error("AI chat error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI chat response",
      error: error.message
    });
  }
};


// =====================================================
// GET CHAT HISTORY
// =====================================================

const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.user.userId
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Chat history fetched successfully",
      count: chats.length,
      chats: chats
    });
  } catch (error) {
    console.error("Chat history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: error.message
    });
  }
};


// =====================================================
// DELETE CHAT HISTORY
// =====================================================

const deleteChatHistory = async (req, res) => {
  try {
    const result = await Chat.deleteMany({
      userId: req.user.userId
    });

    return res.status(200).json({
      success: true,
      message: "Chat history deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Delete chat history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete chat history",
      error: error.message
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getFitnessRecommendation,
  chatWithAI,
  getChatHistory,
  deleteChatHistory
};