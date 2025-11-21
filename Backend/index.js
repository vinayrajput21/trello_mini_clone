import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";


const app = express();
const PORT = process.env.PORT;

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1);
}

app.use(cors({ origin: "https://your-frontend.netlify.app" }));
app.use(cors());
app.use(express.json());

import authRoutes from "./Routes/auth.route.js";
import boardRoutes from "./Routes/board.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);

app.get("/", (req, res) => res.send("Trello-mini backend running"));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
