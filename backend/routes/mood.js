import express from 'express';
import { logMood } from '../controllers/moodController.js';
const router = express.Router();
router.post('/log', logMood);
export default router;
