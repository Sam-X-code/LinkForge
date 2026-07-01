import { getChannel } from "./rabbitmq.js";

export const publishClickEvent = async ({
    shortCode,
    ip,
    userAgent,
    referrer
}) => {

    const channel = getChannel();

    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
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

};