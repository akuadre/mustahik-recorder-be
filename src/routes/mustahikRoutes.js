import express from "express";
import {
  createMustahik,
  getAllMustahik,
  getMustahikById,
  updateMustahik,
  deleteMustahik,
} from "../controllers/mustahikController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadMustahik } from "../middlewares/uploadMustahik.js";

const router = express.Router();

// semua mustahik wajib login
router.post(
  "/",
  authMiddleware,
  uploadMustahik.fields([
    { name: "fotoMustahik", maxCount: 1 },
    { name: "ttdMustahik", maxCount: 1 },
    { name: "dokumenLain", maxCount: 1 },
  ]),
  createMustahik,
);

router.get("/", authMiddleware, getAllMustahik);
router.get("/:id", authMiddleware, getMustahikById);
router.put("/:id", authMiddleware, updateMustahik);
router.delete("/:id", authMiddleware, deleteMustahik);

export default router;
