require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3002,
  mongoURI: process.env.MONGODB_ORDER_URI || "mongodb://localhost/orders",
  rabbitMQURI: process.env.RABBITMQ_URI || "amqp://localhost",
  exchangeName: "orders",
  queueName: "orders",
};
