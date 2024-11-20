const ProductsService = require("../services/productsService.js");
const messageBroker = require("../utils/messageBroker");

/**
 * Class to hold the API implementation for the product services
 */
class ProductController {
  constructor() {
    this.productsService = new ProductsService();

    // Make sure to bind methods
    this.createProduct = this.createProduct.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.getProductsByPriceRange = this.getProductsByPriceRange.bind(this);
    this.getProductsByQuantityRange = this.getProductsByQuantityRange.bind(this);
    this.applyDiscountToProduct = this.applyDiscountToProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);

    // // Bind the method for message consumption
    // this.consumeOrderCompletedMessage = this.consumeOrderCompletedMessage.bind(this);

    // // Start consuming messages from RabbitMQ
    // this.consumeOrderCompletedMessage();
  }

  async createProduct(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const createdProduct = await this.productsService.createProduct(req.body);
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getProducts(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const products = await this.productsService.getProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getProductById(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { productId } = req.params;
      const product = await this.productsService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get products by price range
  async getProductsByPriceRange(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { minPrice, maxPrice } = req.query;
      const products = await this.productsService.getProductsByPriceRange(Number(minPrice), Number(maxPrice));

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get products by quantity range
  async getProductsByQuantityRange(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { minQuantity, maxQuantity } = req.query;

      if (isNaN(minQuantity) || isNaN(maxQuantity)) {
        return res.status(400).json({ message: "Invalid quantity range provided" });
      }

      const products = await this.productsService.getProductsByQuantityRange(Number(minQuantity), Number(maxQuantity));
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products by quantity range:', error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Apply discount to a product
  async applyDiscountToProduct(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { productId, discount } = req.body;
      const updatedProduct = await this.productsService.applyDiscountToProduct(productId, Number(discount));

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Consume RabbitMQ messages for reducing product quantities
  // async consumeOrderCompletedMessage() {
  //   try {
  //     // Consume messages from RabbitMQ when an order is completed
  //     await messageBroker.consumeMessage('orders', async (message) => {
  //       if (message.event === 'ORDER_COMPLETED') {
  //         console.log('Order completed message received:', message);

  //         // Extract the product data from the message
  //         const { products } = message;

  //         // Call the service to reduce the product quantities
  //         await this.productsService.reduceProductQuantities(products);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error consuming order completed message:', error.message);
  //   }
  // }
}

module.exports = ProductController;
