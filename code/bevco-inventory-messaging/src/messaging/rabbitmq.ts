import client, { Connection, Channel, ConsumeMessage } from 'amqplib'
import { Inventory } from '../models/inventory';

type HandlerCB = (msg: string) => any;

export class Consumer {
    connection!: Connection;
    channel!: Channel;
    url: string;
    username: string;
    password: string;
    queueName: string;
    private connected!: Boolean;

    constructor(url: string, username: string, password: string, queueName: string) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.queueName = queueName;
    }
    
    async init() {
        if(this.connected && this.channel) return;

        try {
            const connectionString = `amqp://${this.username}:${this.password}@${this.url}:5672`
            this.connection = await client.connect(connectionString);
            console.log(`RabbitMQ connection is ready`);

            console.log(`Create Rabbit MQ channel`);
            this.channel = await this.connection.createChannel();
            console.log(`Created RabbitMQ channel successfully`);

            this.connected = true;
        }
        catch(err) {
            console.error(err);
            console.error(`Failed to connect to RabbitMQ`)
        }
    }

    async consume(handleIncomingNotification: HandlerCB) {
        await this.channel.assertQueue(this.queueName, {
            durable: true,
        });

        this.channel.consume(
            this.queueName, 
            (msg) => {
                {
                    if (!msg) {
                        return console.error(`Invalid incoming message`);
                    }

                    handleIncomingNotification(msg?.content?.toString());
                    this.channel.ack(msg);
                }
            },
            {
                noAck: false,
            }
        );
    }
}