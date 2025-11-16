import express from "express";
import multer from "multer";
import { scanFood } from "../controllers/scanController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/scan-food", upload.single("image"), scanFood);

export default router;
