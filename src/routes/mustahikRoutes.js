import express from "express";
import {
  createMustahik,
  getAllMustahik,
  getMustahikById,
  updateMustahik,
  deleteMustahik,
} from "../controllers/mustahikController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// semua mustahik wajib login
router.post("/", authMiddleware, createMustahik);
router.get("/", authMiddleware, getAllMustahik);
router.get("/:id", authMiddleware, getMustahikById);
router.put("/:id", authMiddleware, updateMustahik);
router.delete("/:id", authMiddleware, deleteMustahik);

export default router;
