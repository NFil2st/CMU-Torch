import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", scanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
