const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const setupMessageBrokerFunc = require("./utils/setupMessageBroker");
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
    setupMessageBrokerFunc()
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
