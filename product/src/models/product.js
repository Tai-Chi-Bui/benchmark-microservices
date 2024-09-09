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
  },
  description: { 
    type: String, 
    default: "No description provided",  // Default value for description
    trim: true 
  },
}, { 
  collection: 'products', 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Virtual to format product's name and price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;  // Format price to 2 decimal places
});

// Static method to find products within a price range
productSchema.statics.findByPriceRange = function(min, max) {
  return this.find({ price: { $gte: min, $lte: max } }).lean();
};

// Instance method to apply a discount to the product price
productSchema.methods.applyDiscount = function(discount) {
  this.price = this.price * (1 - discount);
  return this.save();
};

// Create and export Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
