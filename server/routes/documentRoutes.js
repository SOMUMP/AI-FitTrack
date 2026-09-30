const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middleware/auth");

const {
  uploadDocument,
  getDocuments,
  deleteDocument
} = require("../controllers/documentController");

const router = express.Router();

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage
});


// =====================================================
// UPLOAD DOCUMENT
// =====================================================

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);


// =====================================================
// GET USER DOCUMENTS
// =====================================================

router.get(
  "/",
  authMiddleware,
  getDocuments
);


// =====================================================
// DELETE DOCUMENT
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteDocument
);


module.exports = router;