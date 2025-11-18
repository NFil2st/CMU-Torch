import express from "express";
import { updateMood } from "../controllers/moodController.js";

const router = express.Router();

router.post("/updateMood", updateMood);

export default router;
