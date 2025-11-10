import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || 'uploads/resumes';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext);
    const unique = `${basename}-${Date.now()}${ext}`;
    cb(null, unique);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') return cb(new Error('Only PDF files are allowed'));
  cb(null, true);
};

export const resumeUpload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
