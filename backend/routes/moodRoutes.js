import express from "express";
import { updateMood, getAllMoods } from "../controllers/moodController.js";

const router = express.Router();

router.post("/updateMood", updateMood);
router.get("/get-moods", getAllMoods);

export default router;
