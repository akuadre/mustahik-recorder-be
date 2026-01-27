import multer from "multer";
import path from "path";
import crypto from "crypto";

// lokasi simpan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/santunan");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${randomName}${ext}`);
  },
});

// filter file
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file tidak didukung"), false);
  }
};

export const uploadSantunan = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
