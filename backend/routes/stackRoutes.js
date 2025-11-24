import express from "express";
import { getStack } from "../controllers/stackController.js";

const router = express.Router();

router.get("/getStack", getStack);

export default router;
