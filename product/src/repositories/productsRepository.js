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
