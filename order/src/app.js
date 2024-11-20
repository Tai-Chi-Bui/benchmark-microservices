const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const MessageBroker = require("./utils/messageBroker");
const ordersRouter = require("./routes/orderRoutes");
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
    this.app.use("/", ordersRouter);
  }

  async setupMessageBroker() {
    try {
      console.log("Waiting few seconds before connecting to RabbitMQ...");
      await new Promise((resolve) => setTimeout(resolve, 30000));
      
      await MessageBroker.connect();
    } catch (error) {
      console.error("Failed to setup RabbitMQ consumer:", error);
    }
  }

  // setupMessageBroker() {
  //   MessageBroker.connect();
  // }

  start() {
    this.server = this.app.listen(3002, () =>
      console.log("Server started on port 3002")
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
