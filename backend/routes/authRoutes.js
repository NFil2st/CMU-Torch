import express from "express";
import {
  sendOtp,
  verifyOtp,
  register,
  login,
  getMe,
  getMoodFood,
  getMoodExercise,
  getMood
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.get('/me', getMe);
router.post("/login", login);
router.get("/getMoodFood", getMoodFood);
router.get("/getMoodExercise", getMoodExercise);
router.get("/getMood", getMood);

export default router;
