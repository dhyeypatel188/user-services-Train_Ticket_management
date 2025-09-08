import express from "express";
import "reflect-metadata"; // <-- This must be the FIRST import
import cors from "cors";
import bodyParser from "body-parser";
import adminRoutes from "./Admin/admin.router";
import authRouters from "./Auth/auth.router";
import userRoutes from "./User/user.router";
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", adminRoutes);
app.use("/api", authRouters);
app.use("/api", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling middleware

export default app;
