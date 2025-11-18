import express from "express";
import { completeExercise } from "../controllers/exerciseController.js";

const router = express.Router();

router.post("/completeExercise", completeExercise);

export default router;
