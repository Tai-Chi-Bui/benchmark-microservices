// models/product.js in the Product service
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    index: true, 
  },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Price must be a positive number'],
    index: true, 
  },
  description: { 
    type: String, 
    default: "No description provided",
    trim: true 
  },
  quantity: { 
    type: Number, 
    default: 0,
    min: [0, 'Quantity must be a non-negative number'],
    index: true,
  }  
}, { 
  collection: 'products',
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
