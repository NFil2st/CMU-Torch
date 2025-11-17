import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", scanRoutes);
app.use("/api", moodRoutes);
app.use("/api", exerciseRoutes);
app.use("/api", foodRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
