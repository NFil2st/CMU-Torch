import express from "express";
import { completeFood } from "../controllers/foodController.js";
import { getFood } from "../controllers/foodController.js";
import { getFoodList } from "../controllers/foodController.js";
import { getFoodLocations } from "../controllers/foodController.js";

const router = express.Router();

router.post("/completeFood", completeFood);
router.get("/getFood", getFood);
router.get("/getFoodList", getFoodList);
router.get("/getFoodPlaces", getFoodLocations);

export default router;
