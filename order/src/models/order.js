const mongoose = require('mongoose');

// Schema for individual products in an order, linked to the Product collection
const productSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', // Reference to the Product document in the Product collection
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, // Number of units ordered
    min: [1, 'Quantity must be at least 1'] // Ensure at least 1 product is ordered
  },
  price: { 
    type: Number, 
    required: true // Store the price of the product at the time of ordering
  }
}, { _id: false }); // Disable automatic _id generation for this subdocument

// Define the schema for an order
const orderSchema = new mongoose.Schema({
  // Array of products associated with this order
  products: [productSchema],  // Each product is linked to the Product collection and includes details

  // Total amount to be paid for the order
  totalAmount: { 
    type: Number, 
    required: true, 
    min: [0, 'Total amount must be a positive number'] // Ensure the total amount is non-negative
  },

  // Payment details for the order
  paymentDetails: {
    method: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Bank Transfer'], // Allowed payment methods
      required: true // Payment method is mandatory
    },
    status: {
      type: String,
      enum: ['Pending', 'Received'], // Payment status can be either pending or received
      required: true // Status is mandatory
    },
    reference: { 
      type: String, 
      default: '' // Transaction or reference ID for the payment, can be optional
    }
  },

  // Delivery details for the order
  deliveryDetails: {
    recipientName: {
      type: String,
      default: 'James Whitman' // Default recipient name (can be changed to dynamic later)
    },
    recipientPhone: {
      type: String,
      default: '0995655199' // Default phone number (can be dynamic)
    },
    destination: {
      type: String,
      default: '45 Pine St, Apt 2A, Brookville, 54321' // Default delivery address
    },
    tracking: {
      type: String,
      enum: ['Warehouse', 'In Transit', `Customer's Door`], // Possible tracking stages for the delivery
      required: true // Tracking status is mandatory
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'], // Delivery status can be either pending or completed
      required: true // Delivery status is mandatory
    }
  },

  // Order status
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled', 'Rejected by the Seller'], // Possible order statuses
    required: true // Order status is mandatory
  }
}, { 
  collection: 'orders', // Specify collection name in MongoDB as 'orders'
  timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } // Automatically create timestamps for order creation and update
});

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
