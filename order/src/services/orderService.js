const OrdersRepository = require("../repositories/orderRepository");

/**
 * Class that ties together the business logic and the data access layer for orders
 */
class OrdersService {
  constructor() {
    this.ordersRepository = new OrdersRepository();
  }

  async createOrder(order) {
    try {
      // Add any business logic, validation, or transformations here if needed
      const createdOrder = await this.ordersRepository.create(order);
      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error.message);
      throw new Error('Failed to create order');
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await this.ordersRepository.findById(orderId);
      return order;
    } catch (error) {
      console.error('Error fetching order by ID:', error.message);
      throw new Error('Failed to retrieve order');
    }
  }

  async getOrders(status, minAmount, maxAmount, startDate, endDate) {
    try {
      // Build query based on provided filters
      const query = {};
      if (status) query.status = status;
      if (minAmount && maxAmount) query.totalAmount = { $gte: minAmount, $lte: maxAmount };
      if (startDate && endDate) {
        query.createdDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const orders = await this.ordersRepository.findAll(query);
      return orders;
    } catch (error) {
      console.error('Error fetching all orders:', error.message);
      throw new Error('Failed to retrieve orders');
    }
  }

  // Service method to find orders by status
  async getOrdersByStatus(status) {
    try {
      const orders = await this.ordersRepository.findOrdersByStatus(status);
      return orders;
    } catch (error) {
      console.error('Error fetching orders by status:', error.message);
      throw new Error('Failed to retrieve orders by status');
    }
  }

  // Service method to update order status
  async updateOrderStatus(orderId, newStatus) {
    try {
      // Add any business logic or validation for status change if needed
      const updatedOrder = await this.ordersRepository.updateStatus(orderId, newStatus);
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error.message);
      throw new Error('Failed to update order status');
    }
  }
}

module.exports = OrdersService;
