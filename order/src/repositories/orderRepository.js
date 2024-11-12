const Order = require("../models/order"); // Import the Order model

/**
 * Class that contains the business logic for the order repository interacting with the order model
 */
class OrdersRepository {
  async create(order) {
    try {
      const createdOrder = await Order.create(order);
      return createdOrder.toObject(); // Return plain JavaScript object
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async findById(orderId) {
    try {
      const order = await Order.findById(orderId)
        .populate('products.productId', 'name') // Populate product names from the Product collection
        .lean(); // Return lean object for better performance
      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      return order;
    } catch (error) {
      console.error('Error finding order by ID:', error);
      throw new Error('Failed to find order by ID');
    }
  }

  async findAll(query) {
    try {
      const orders = await Order.find(query)
        .populate('products.productId', 'name') // Populate product names from the Product collection
        .lean(); // Use lean for performance
      // console.log("orders: ", orders);
      return orders;
    } catch (error) {
      console.error('Error finding all orders:', error);
      throw new Error('Failed to retrieve orders');
    }
  }

  async findOrdersByStatus(status) {
    try {
      const orders = await Order.find({ status })
        .populate('products.productId', 'name') // Populate product names from the Product collection
        .lean(); // Use lean for performance
      return orders;
    } catch (error) {
      console.error('Error finding orders by status:', error);
      throw new Error('Failed to retrieve orders by status');
    }
  }

  async updateStatus(orderId, newStatus) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      order.status = newStatus; // Update order status
      await order.save();
      return order.toObject(); // Return plain JavaScript object after saving
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      order.paymentDetails.status = paymentStatus; // Update payment status
      await order.save();
      return order.toObject(); // Return plain JavaScript object after saving
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }
}

module.exports = OrdersRepository;
