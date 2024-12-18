const express = require("express");
const OrderController = require("../controllers/orderController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const orderController = new OrderController();

// Create a new order
router.post("/", isAuthenticated, orderController.createOrder);

// Fetch all orders
router.get("/", isAuthenticated, orderController.getOrders);

// Fetch a single order by ID
router.get("/:orderId", isAuthenticated, orderController.getOrderById);

// Update order status (e.g., mark as Completed or Cancelled)
router.patch("/status", isAuthenticated, orderController.updateOrderStatus);

module.exports = router;
