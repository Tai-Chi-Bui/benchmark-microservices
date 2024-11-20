const Product = require("../models/product"); // Import the updated product model

/**
 * Class that contains the business logic for the product repository interacting with the product model
 */
class ProductsRepository {
  async create(product) {
    try {
      const createdProduct = await Product.create(product);
      return createdProduct.toObject(); // Return plain JavaScript object
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async findById(productId) {
    try {
      const product = await Product.findById(productId).lean(); // Return lean object for better performance
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      return product;
    } catch (error) {
      console.error('Error finding product by ID:', error);
      throw new Error('Failed to find product by ID');
    }
  }

  async reduceQuantityById(productId, quantityToReduce) {
    try {
      // Find the product by its ID
      const product = await Product.findById(productId);
  
      // If product not found, throw an error
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
  
      // Check if there's enough quantity to reduce
      if (product.quantity < quantityToReduce) {
        throw new Error(
          `Insufficient quantity for product with ID ${productId}. Available: ${product.quantity}, Requested: ${quantityToReduce}`
        );
      }
  
      // Reduce the quantity
      product.quantity -= quantityToReduce;
  
      // Save the updated product to the database
      await product.save();
  
      // Return the updated product as a plain JavaScript object
      return product.toObject();
    } catch (error) {
      console.error('Error reducing product quantity:', error);
      throw new Error('Failed to reduce product quantity');
    }
  }
  

  async findAll() {
    try {
      const products = await Product.find().lean(); // Use lean for performance
      return products;
    } catch (error) {
      console.error('Error finding all products:', error);
      throw new Error('Failed to retrieve products');
    }
  }

  async findProductsByPriceRange(minPrice, maxPrice) {
    try {
      const products = await Product.findByPriceRange(minPrice, maxPrice); // Use static method for price range
      return products;
    } catch (error) {
      console.error('Error finding products by price range:', error);
      throw new Error('Failed to retrieve products by price range');
    }
  }

  async findProductsByQuantityRange(minQuantity, maxQuantity) {
    try {
      const products = await Product.findByQuantityRange(minQuantity, maxQuantity); // Use static method for quantity range
      return products;
    } catch (error) {
      console.error('Error finding products by quantity range:', error);
      throw new Error('Failed to retrieve products by quantity range');
    }
  }
  

  async applyDiscountToProduct(productId, discount) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      await product.applyDiscount(discount); // Use instance method to apply discount
      return product.toObject(); // Return plain JavaScript object after saving
    } catch (error) {
      console.error('Error applying discount to product:', error);
      throw new Error('Failed to apply discount');
    }
  }
}

module.exports = ProductsRepository;
