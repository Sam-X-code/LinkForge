import amqp from "amqplib";

let connection;
let channel;

export const connectRabbitMQ = async () => {

    while (true) {
        try {

            connection = await amqp.connect("amqp://rabbitmq");

            channel = await connection.createChannel();

            await channel.assertQueue("click-events", {
                durable: true
            });

            console.log("✅ RabbitMQ Connected");

            break;

        } catch (error) {

            console.log("⏳ Waiting for RabbitMQ...");

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

export const getChannel = () => channel;