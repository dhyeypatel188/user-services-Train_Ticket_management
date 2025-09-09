import express from "express";
import "reflect-metadata"; // <-- This must be the FIRST import
import cors from "cors";
import bodyParser from "body-parser";
import adminRoutes from "./Admin/admin.router";
import authRouters from "./Auth/auth.router";
import userRoutes from "./User/user.router";
const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins (you can restrict to your frontend URL later)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options("*", cors());

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
