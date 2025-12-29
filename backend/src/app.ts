// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.route";

dotenv.config();

// Express App Setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// Health Check Route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Chat Routes
app.use("/chat", chatRouter);

export { app };
