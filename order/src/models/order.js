const mongoose = require('mongoose');
require('./product'); // Ensure Product model is registered

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
  products: [productSchema],  // Each product is linked to the Product collection and includes details

  totalAmount: { 
    type: Number, 
    required: true, 
    min: [0, 'Total amount must be a positive number'] // Ensure the total amount is non-negative
  },

  paymentDetails: {
    method: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Bank Transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Received'],
      required: true
    },
    reference: { 
      type: String, 
      default: '' 
    }
  },

  deliveryDetails: {
    recipientName: { type: String, default: 'James Whitman' },
    recipientPhone: { type: String, default: '0995655199' },
    destination: { type: String, default: '45 Pine St, Apt 2A, Brookville, 54321' },
    tracking: {
      type: String,
      enum: ['Warehouse', 'In Transit', `Customer's Door`],
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      required: true
    }
  },

  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled', 'Rejected by the Seller'],
    required: true
  }
}, { 
  collection: 'orders',
  timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' }
});

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
