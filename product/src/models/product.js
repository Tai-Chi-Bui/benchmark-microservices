const mongoose = require("mongoose");

// Define product schema
const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,  // Remove whitespace around strings
    index: true, // Index for faster queries
  },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Price must be a positive number'],  // Ensure positive price
    index: true, // Add index on price for faster queries
  },
  description: { 
    type: String, 
    default: "No description provided",  // Default value for description
    trim: true 
  },
  quantity: { 
    type: Number, 
    default: 0,  // Default value for quantity
    min: [0, 'Quantity must be a non-negative number'],  // Validation for non-negative numbers
    index: true, // Add index on quantity for inventory queries
  }  
}, { 
  collection: 'products', 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Add a compound index if queries often combine price and quantity
productSchema.index({ price: 1, quantity: 1 });

// Virtual to format product's name and price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;  // Format price to 2 decimal places
});

// Common helper for range queries
productSchema.statics.findInRange = function(field, min, max) {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Both min and max values must be numbers');
  }
  if (min > max) {
    throw new Error('Min value cannot be greater than max value');
  }
  const query = {};
  query[field] = { $gte: min, $lte: max };
  return this.find(query).lean();
};

// Static method to find products within a price range
productSchema.statics.findByPriceRange = function(min, max) {
  return this.findInRange('price', min, max);
};

// Static method to find products within a quantity in inventory range
productSchema.statics.findByQuantityRange = function(min, max) {
  return this.findInRange('quantity', min, max);
};

// Instance method to apply a discount to the product price
productSchema.methods.applyDiscount = function(discount) {
  if (discount < 0 || discount > 1) {
    throw new Error('Discount must be a number between 0 and 1');
  }
  this.price = this.price * (1 - discount);
  return this.save();
};

// Create and export Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
