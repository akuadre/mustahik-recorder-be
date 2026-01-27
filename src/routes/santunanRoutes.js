import express from "express";
import {
  createSantunan,
  getAllSantunan,
  getSantunanById,
  getSantunanSummary
} from "../controllers/santunanController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadSantunan } from "../middlewares/uploadSantunan.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  uploadSantunan.fields([
    { name: "ttdPenerima", maxCount: 1 },
    { name: "dokumentasi", maxCount: 1 },
  ]),
  createSantunan,
);

router.get("/", authMiddleware, getAllSantunan);
router.get("/:id", authMiddleware, getSantunanById);

router.get("/dashboard/summary", authMiddleware, getSantunanSummary);

export default router;
