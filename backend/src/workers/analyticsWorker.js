import connectDB from "../db/dbConnection.js";
import { connectRabbitMQ } from "../queues/rabbitmq.js";
import { consumeQueue } from "../queues/consumer.js";
import Url from "../models/url.model.js";

await connectDB();

await connectRabbitMQ();

console.log("🚀 Analytics Worker Started");

await consumeQueue("click-events", async (event) => {
    try {

        await Url.findOneAndUpdate(
            {
                shortCode: event.shortCode
            },
            {
                $inc: {
                    clicks: 1
                }
            }
        );

        console.log(`✅ Processed click for ${event.shortCode}`);

    } catch (error) {

        console.error(
            `❌ Failed to process ${event.shortCode}`,
            error
        );
    }
});

process.on("SIGINT", () => {
    console.log("🛑 Analytics Worker Stopped");
    process.exit(0);
});