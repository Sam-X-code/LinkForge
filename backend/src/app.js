import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import os from "os";

import userRouter from "./routes/user.route.js";
import urlRouter from "./routes/url.routes.js";
import healthRouter from "./routes/health.route.js";
import {redirectUrl}  from "./controllers/url.controller.js";
import errorHandler from "./middlewares/error.middleware.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";
import mongoose from "mongoose";
import  redisClient  from "./config/redis.js";
import { getChannel } from "./queues/rabbitmq.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/urls", urlRouter);

// Health Check
app.use("/health", healthRouter);

// Redirect Route
app.get("/:shortCode", rateLimiter(100, 60), redirectUrl);

app.use(errorHandler);

export default app;