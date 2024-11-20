const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const MessageBroker = require("./utils/messageBroker");
const productsRouter = require("./routes/productRoutes");
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
    this.setupMessageBroker();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    this.app.use("/", productsRouter);
  }

  setupMessageBroker() {
    console.log("Waiting 30 seconds before connecting to RabbitMQ...");
    new Promise((resolve) => setTimeout(resolve, 30000)) // 30-second delay
      .then(() => MessageBroker.connect())
      .then(() => {
        console.log("RabbitMQ connection established. Setting up consumer...");
        MessageBroker.consumeMessage("orders", (message) => {
          console.log("Processing message:", message);
          // Add your business logic here
          if (message.orderId) {
            console.log(`Processing order ID: ${message.orderId}`);
          }
        });
      })
      .catch((error) => {
        console.error("Failed to setup RabbitMQ consumer:", error);
      });
  }
  
  
  

  start() {
    this.server = this.app.listen(3001, () =>
      console.log("Server started on port 3001")
    );
  }

  async stop() {
    await mongoose.disconnect();
    if (this.server) {
      this.server.close();
      console.log("Server stopped");
    }
  }
}

module.exports = App;
