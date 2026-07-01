import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/dbConnection.js";
import redisClient from "./config/redis.js";
import { connectRabbitMQ } from "./queues/rabbitmq.js";

dotenv.config({
    path: "./.env"
});

const startServer = async () => {
    try {
        await connectDB();

        try {
            await redisClient.connect();
            console.log("✅ Redis Connected");
        } catch (err) {
            console.log("⚠️ Redis unavailable");
        }

        try {
            await connectRabbitMQ();
        } catch (err) {
            console.log("⚠️ RabbitMQ unavailable");
        }

        app.listen(process.env.PORT || 8000, () => {
            console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
        });

    } catch (error) {
        console.error("❌ Server startup failed!", error);
        process.exit(1);
    }
};

startServer();