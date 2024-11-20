const MessageBroker = require("./messageBroker");
/**
 * Sets up RabbitMQ with a 30-second delay and processes messages.
 */
function setupMessageBroker() {
  console.log("Waiting 30 seconds before connecting to RabbitMQ...");
  new Promise((resolve) => setTimeout(resolve, 30000)) // 30-second delay
    .then(() => MessageBroker.connect())
    .then(() => {
      //console.log("RabbitMQ connection established. Setting up consumer...");
      // setup consumer or any other logics if you'd like
    })
    .catch((error) => {
      console.error("Failed to setup RabbitMQ consumer:", error);
    });
}

module.exports = setupMessageBroker;
