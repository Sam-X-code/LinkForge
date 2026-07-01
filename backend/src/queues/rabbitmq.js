import amqp from "amqplib";

let connection;
let channel;

export const connectRabbitMQ = async () => {

    if (process.env.NODE_ENV === "production") {
        try {
            connection = await amqp.connect(process.env.RABBITMQ_URL);

            channel = await connection.createChannel();

            await channel.assertQueue("click-events", {
                durable: true
            });

            console.log("✅ RabbitMQ Connected");

        } catch (err) {

            console.log("⚠️ RabbitMQ unavailable");

            return;
        }

        return;
    }

    // Local Docker: keep retrying
    while (true) {
        try {
            connection = await amqp.connect("amqp://rabbitmq");

            channel = await connection.createChannel();

            await channel.assertQueue("click-events", {
                durable: true
            });

            console.log("✅ RabbitMQ Connected");
            break;

        } catch {
            console.log("⏳ Waiting for RabbitMQ...");
            await new Promise(r => setTimeout(r, 5000));
        }
    }
};

export const getChannel = () => channel;