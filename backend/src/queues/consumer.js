import { getChannel } from "./rabbitmq.js";

export const consumeQueue = async (queue, callback) => {

    const channel = getChannel();

    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }

    await channel.assertQueue(queue, {
        durable: true
    });

    channel.consume(queue, async (msg) => {

        if (!msg) return;

        const data = JSON.parse(
            msg.content.toString()
        );

        await callback(data);

        channel.ack(msg);

    });

};