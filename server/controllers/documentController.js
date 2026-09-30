const Document = require("../models/Document");

// =====================================================
// UPLOAD DOCUMENT
// =====================================================

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required"
      });
    }

    const document = await Document.create({
      userId: req.user.userId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path,
      extractedText: "",
      status: "uploaded"
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document
    });
  } catch (error) {
    console.error("Document upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message
    });
  }
};


// =====================================================
// GET USER DOCUMENTS
// =====================================================

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      userId: req.user.userId
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      count: documents.length,
      documents
    });
  } catch (error) {
    console.error("Get documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message
    });
  }
};


// =====================================================
// DELETE DOCUMENT
// =====================================================

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    await Document.deleteOne({
      _id: document._id
    });

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument
};