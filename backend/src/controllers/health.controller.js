import mongoose from "mongoose";
import redisClient from "../config/redis.js";
import { getChannel } from "../queues/rabbitmq.js";

const healthCheck = async (req, res) => {
    const mongoStatus =
        mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected";

    const redisStatus =
        redisClient.isOpen
            ? "connected"
            : "disconnected";

    const rabbitStatus =
        getChannel()
            ? "connected"
            : "disconnected";

    res.status(200).json({
        success: true,
        instance: process.env.INSTANCE_NAME || "local",
        status: "healthy",
        services: {
            mongodb: mongoStatus,
            redis: redisStatus,
            rabbitmq: rabbitStatus
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
};

export default healthCheck;