import amqplib, { Connection, Channel, ConsumeMessage } from 'amqplib'
import { Inventory } from '../models/inventory';

type HandlerCB = (msg: string) => any;

export class Consumer {
    connection!: Connection;
    channel!: Channel;
    url: string;
    username: string;
    password: string;
    channelName: string;
    queueName: string;
    exchangeType: string;
    pattern: string
    private connected!: Boolean;

    constructor(url: string, username: string, password: string, channelName: string, exchangeType: string, queueName: string, pattern: string) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.channelName = channelName;
        this.queueName = queueName;
        this.exchangeType = exchangeType;
        this.pattern = pattern;
    }
    
    async init() {
        if(this.connected && this.channel) return;

        try {
            const connectionString = `amqp://${this.username}:${this.password}@${this.url}:5672`
            console.log(`Connecting to Rabbit-MQ server on amqp://${this.url}:5672`);
            this.connection = await amqplib.connect(`amqp://default_user_OWCSlqjGNxdLPTw71WN:jtjgPlcKQy1KDQt0bo_Nxlixs1btEZAh@${this.url}:5672`);
            console.log(`RabbitMQ connection is ready`);

            console.log(`Create Rabbit MQ channel`);
            this.channel = await this.connection.createChannel();
            console.log(`Created RabbitMQ channel successfully`);

            await this.channel.assertExchange(this.channelName, this.exchangeType);

            this.connected = true;
        }
        catch(err) {
            console.error(err);
            console.error(`Failed to connect to RabbitMQ`)
        }
    }

    async consume(handleIncomingNotification: HandlerCB) {
        const q = await this.channel.assertQueue(this.queueName);
        await this.channel.bindQueue(q.queue, this.channelName, this.pattern);

        this.channel.consume(q.queue, async (msg) => {
            {
                if (!msg) {
                    return console.error(`Invalid incoming message`);
                }

                console.log("message reseived");
                const data = JSON.parse(msg?.content?.toString());

                console.log("parsed data:");
                console.log(data);
                
                const inventory = await Inventory.findById(data.inventoryId);
                const newQuanity = inventory?.quanity + data.quanity

                console.log(`new quanity ${newQuanity}`)
                await Inventory.findByIdAndUpdate(data.inventoryId, { quanity: newQuanity }, { new: true });

                handleIncomingNotification(msg?.content?.toString());
                this.channel.ack(msg);
            }},
            {
                noAck: false,
            }
        );
    }
}