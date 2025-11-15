import { Router } from "express";
import { extractText } from "../controllers/OCR.js";
import multer from "multer";

const router = Router();
const upload = multer({ 
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// OCR text extraction endpoint
router.post("/extract", upload.single('image'), extractText);

export default router;