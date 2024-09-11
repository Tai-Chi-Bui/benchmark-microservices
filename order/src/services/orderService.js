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

  async getOrders() {
    try {
      const orders = await this.ordersRepository.findAll();
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

  // Service method to update payment status
  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      // Add validation for payment status if needed
      const updatedOrder = await this.ordersRepository.updatePaymentStatus(orderId, paymentStatus);
      return updatedOrder;
    } catch (error) {
      console.error('Error updating payment status:', error.message);
      throw new Error('Failed to update payment status');
    }
  }
}

module.exports = OrdersService;
