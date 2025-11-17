import express from "express";
import { completeFood } from "../controllers/foodController.js";

const router = express.Router();

router.post("/completeFood", completeFood);

export default router;
