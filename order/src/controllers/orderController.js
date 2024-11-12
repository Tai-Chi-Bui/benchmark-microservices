const OrdersService = require("../services/orderService.js");
const messageBroker = require("../utils/messageBroker"); // RabbitMQ broker

/**
 * Class to hold the API implementation for the order services
 */
class OrderController {
  constructor() {
    this.ordersService = new OrdersService();

    // Bind methods to the class context
    this.createOrder = this.createOrder.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.getOrdersByStatus = this.getOrdersByStatus.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.updatePaymentStatus = this.updatePaymentStatus.bind(this);
  }

  // Method to create a new order
  async createOrder(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const createdOrder = await this.ordersService.createOrder(req.body);
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Error creating order:', error.message);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Method to get an order by ID
  async getOrderById(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { orderId } = req.params;
      const order = await this.ordersService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order by ID:', error.message);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Method to get all orders
  async getOrders(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { status, minAmount, maxAmount, startDate, endDate } = req.query;


      const orders = await this.ordersService.getOrders( status, minAmount, maxAmount, startDate, endDate);
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching all orders:', error.message);
      res.status(500).json({ message: "Server error" });
    }
  }


  // Method to get orders by status
  async getOrdersByStatus(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { status } = req.query;
      const orders = await this.ordersService.getOrdersByStatus(status);
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders by status:', error.message);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Method to update order status and communicate with product service via RabbitMQ
  async updateOrderStatus(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { orderId, newStatus } = req.body;
      const updatedOrder = await this.ordersService.updateOrderStatus(orderId, newStatus);

      // Check if the order is marked as completed
      if (newStatus === 'Completed') {
        // Publish message to RabbitMQ for updating product quantities
        const orderProducts = updatedOrder.products.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
        }));

        console.log("Publishing message to RabbitMQ:", orderProducts);

        await messageBroker.publishMessage('orders', {
          event: 'ORDER_COMPLETED',
          orderId: updatedOrder._id,
          products: orderProducts,
        });

        console.log("Message published to RabbitMQ for order completion");
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error.message);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Method to update payment status
  async updatePaymentStatus(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { orderId, paymentStatus } = req.body;
      const updatedOrder = await this.ordersService.updatePaymentStatus(orderId, paymentStatus);
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating payment status:', error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = OrderController;
