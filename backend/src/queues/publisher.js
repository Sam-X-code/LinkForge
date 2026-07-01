import { getChannel } from "./rabbitmq.js";

export const publishClickEvent = async ({
    shortCode,
    ip,
    userAgent,
    referrer
}) => {
    try {
        const channel = getChannel();

        if (!channel) {
            console.log("⚠️ RabbitMQ unavailable. Analytics skipped.");
            return;
        }

        channel.sendToQueue(
            "click-events",
            Buffer.from(
                JSON.stringify({
                    shortCode,
                    ip,
                    userAgent,
                    referrer,
                    timestamp: new Date()
                })
            ),
            {
                persistent: true
            }
        );

    } catch (error) {
        console.error("❌ Failed to publish click event:", error.message);
    }
};