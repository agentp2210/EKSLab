import amqplib, { Connection, Channel, ConsumeMessage } from 'amqplib'

type HandlerCB = (msg: string) => any;

export class Sender {
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
            console.log(`Connecting to Rabbit-MQ server on ${connectionString}`);
            this.connection = await amqplib.connect(connectionString);
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

    async sendToQueue(queueName: string, message: any) {
        try {
            this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        }
        catch(err) {
            console.error(err);;
            throw err;
        }
    }
}