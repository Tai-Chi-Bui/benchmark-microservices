const ProductsRepository = require("../repositories/productsRepository");

/**
 * Class that ties together the business logic and the data access layer
 */
class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async createProduct(product) {
    try {
      // Add basic validation or transformations here if needed
      const createdProduct = await this.productsRepository.create(product);
      return createdProduct;
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw new Error('Failed to create product');
    }
  }

  async getProductById(productId) {
    try {
      const product = await this.productsRepository.findById(productId);
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error.message);
      throw new Error('Failed to retrieve product');
    }
  }

  async getProducts() {
    try {
      const products = await this.productsRepository.findAll();
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error.message);
      throw new Error('Failed to retrieve products');
    }
  }

  // New service method to find products by price range
  async getProductsByPriceRange(minPrice, maxPrice) {
    try {
      const products = await this.productsRepository.findProductsByPriceRange(minPrice, maxPrice);
      return products;
    } catch (error) {
      console.error('Error fetching products by price range:', error.message);
      throw new Error('Failed to retrieve products by price range');
    }
  }

  // New service method to find products by quantity range
  async getProductsByQuantityRange(minQuantity, maxQuantity) {
    try {
      const products = await this.productsRepository.findProductsByQuantityRange(minQuantity, maxQuantity);
      return products;
    } catch (error) {
      console.error('Error fetching products by quantity range:', error.message);
      throw new Error('Failed to retrieve products by quantity range');
    }
  }

  // Service method to apply a discount to a product
  async applyDiscountToProduct(productId, discount) {
    try {
      // Validate discount (ensure it's a number between 0 and 1)
      if (discount < 0 || discount > 1) {
        throw new Error('Invalid discount value. Must be between 0 and 1.');
      }

      const updatedProduct = await this.productsRepository.applyDiscountToProduct(productId, discount);
      return updatedProduct;
    } catch (error) {
      console.error('Error applying discount to product:', error.message);
      throw new Error('Failed to apply discount');
    }
  }

  // New method to reduce product quantities based on an order's products
  async reduceProductQuantities(orderProducts) {
    try {
      for (const product of orderProducts) {
        const { productId, quantity } = product;
        await this.productsRepository.reduceQuantityById(productId, quantity)
      }
    } catch (error) {
      console.error('Error reducing product quantities:', error.message);
      throw new Error('Failed to reduce product quantities');
    }
  }

}

module.exports = ProductsService;
