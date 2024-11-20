const MessageBroker = require("./messageBroker");
const ProductsService = require("../services/productsService"); // Assuming ProductsService handles product-related logic

/**
 * Sets up RabbitMQ with a 30-second delay and processes messages.
 */
function setupMessageBroker() {
  console.log("Waiting 30 seconds before connecting to RabbitMQ...");
  const productsService = new ProductsService();
  new Promise((resolve) => setTimeout(resolve, 30000)) // 30-second delay
    .then(() => MessageBroker.connect())
    .then(() => {
      console.log("RabbitMQ connection established. Setting up consumer...");
      MessageBroker.consumeMessage("orders", async (message) => {
        console.log("Processing message:", message);

        // Business logic for ORDER_COMPLETED event
        if (message.event === "ORDER_COMPLETED") {
          console.log("Order completed message received:", message);

          const { products } = message; // Extract products from the message

          try {
            // Call the service to reduce the product quantities
            await productsService.reduceProductQuantities(products);
            console.log("Product quantities successfully reduced.");
          } catch (error) {
            console.error("Failed to reduce product quantities:", error);
          }
        }
      });
    })
    .catch((error) => {
      console.error("Failed to setup RabbitMQ consumer:", error);
    });
}

module.exports = setupMessageBroker;
