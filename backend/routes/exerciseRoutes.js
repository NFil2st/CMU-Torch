// exerciseRoutes.js (หรือไฟล์ที่คุณตั้งชื่อไว้)

import express from "express";
import { 
    completeExercise, 
    getExercise,
    getExerciseList
} from "../controllers/exerciseController.js";

const router = express.Router();

router.post("/completeExercise", completeExercise);
router.get("/getExercise", getExercise); 
router.get("/getExerciseList", getExerciseList); 

export default router;
