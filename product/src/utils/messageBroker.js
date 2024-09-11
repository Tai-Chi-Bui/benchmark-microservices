const amqp = require("amqplib");

class MessageBroker {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.reconnectInterval = 5000; // Retry connection every 5 seconds
    this.maxRetries = 10; // Maximum number of retries
    this.retries = 0; // Count of retries attempted
  }

  async connect(queueName = "orders") {
    console.log("Connecting to RabbitMQ...");

    const connectToRabbitMQ = async () => {
      try {
        // Try to establish connection and create channel
        this.connection = await amqp.connect("amqp://rabbitmq:5672");
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(queueName);
        console.log("RabbitMQ connected");
        this.retries = 0; // Reset retry counter on successful connection
      } catch (err) {
        this.retries += 1;
        console.error(`Failed to connect to RabbitMQ. Retry ${this.retries}/${this.maxRetries}:`, err.message);

        // Retry connecting after a delay if max retries not reached
        if (this.retries < this.maxRetries) {
          setTimeout(connectToRabbitMQ, this.reconnectInterval);
        } else {
          console.error("Max retries reached. Could not connect to RabbitMQ.");
        }
      }
    };

    // Initiate the connection attempt
    connectToRabbitMQ();
  }

  async publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available. Retrying connection...");
      await this.connect(queue); // Retry connection if channel is not available
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
      await this.connect(queue); // Retry connection if channel is not available
      return;
    }

    try {
      console.log(`Consuming messages from queue: ${queue}`);
      await this.channel.consume(queue, (message) => {
        const content = message.content.toString();
        const parsedContent = JSON.parse(content);
        callback(parsedContent);
        this.channel.ack(message); // Acknowledge the message after processing
      });
    } catch (err) {
      console.error("Failed to consume message:", err);
    }
  }

  // Gracefully close the connection and channel when the service shuts down
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
