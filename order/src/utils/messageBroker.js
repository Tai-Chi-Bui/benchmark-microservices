const amqp = require("amqplib");

class MessageBroker {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.isConnecting = false; // Prevent multiple simultaneous connection attempts
    this.reconnectInterval = 5000; // Retry connection every 5 seconds
    this.maxRetries = 10; // Maximum number of retries
    this.retries = 0; // Count of retries attempted
  }

  async connect() {
    if (this.isConnecting || this.connection) {
      return; // Prevent simultaneous connection attempts
    }

    this.isConnecting = true; // Set flag to indicate connection in progress
    console.log("Connecting to RabbitMQ...");

    const connectToRabbitMQ = async () => {
      try {
        // Establish connection and channel
        this.connection = await amqp.connect("amqp://rabbitmq:5672");
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue("orders");
        console.log("RabbitMQ connected");
        this.retries = 0; // Reset retry counter on success
        this.isConnecting = false; // Clear connecting flag
      } catch (err) {
        this.retries += 1;
        this.isConnecting = false; // Clear connecting flag
        console.error(`Failed to connect to RabbitMQ. Retry ${this.retries}/${this.maxRetries}:`, err.message);

        if (this.retries < this.maxRetries) {
          setTimeout(connectToRabbitMQ, this.reconnectInterval); // Retry after delay
        } else {
          console.error("Max retries reached. Could not connect to RabbitMQ.");
        }
      }
    };

    await connectToRabbitMQ();
  }

  async publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available. Retrying connection...");
      await this.connect();
      return;
    }

    try {
      console.log(`Publishing message to queue: ${queue}`);
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
      console.log("Message sent:", message);
    } catch (err) {
      console.error("Failed to publish message:", err);
    }
  }

  async consumeMessage(queue, callback) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available. Retrying connection...");
      await this.connect(); // Ensure channel is ready
    }

    try {
      console.log(`Consuming messages from queue: ${queue}`);
      await this.channel.consume(queue, (message) => {
        const content = message.content.toString();
        const parsedContent = JSON.parse(content);
        callback(parsedContent);
        this.channel.ack(message);
      });
    } catch (err) {
      console.error("Failed to consume message:", err);
    }
  }

  async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
        console.log("RabbitMQ channel closed.");
      }
      if (this.connection) {
        await this.connection.close();
        console.log("RabbitMQ connection closed.");
      }
    } catch (err) {
      console.error("Error while closing RabbitMQ connection/channel:", err);
    }
  }
}

module.exports = new MessageBroker();
