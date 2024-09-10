const ProductsService = require("../services/productsService.js");
const messageBroker = require("../utils/messageBroker");
const uuid = require('uuid');

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
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.ordersMap = new Map();
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

  async createOrder(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { ids } = req.body;
      const products = await this.productsService.getProductsByIds(ids); // Fetch products via service

      const orderId = uuid.v4(); // Generate a unique order ID
      this.ordersMap.set(orderId, { 
        status: "pending", 
        products, 
        username: req.user.username 
      });

      await messageBroker.publishMessage("orders", {
        products,
        username: req.user.username,
        orderId,
      });

      messageBroker.consumeMessage("products", (data) => {
        const orderData = JSON.parse(JSON.stringify(data));
        const { orderId } = orderData;
        const order = this.ordersMap.get(orderId);
        if (order) {
          // update the order in the map
          this.ordersMap.set(orderId, { ...order, ...orderData, status: 'completed' });
          console.log("Updated order:", order);
        }
      });

      // Long polling until order is completed
      let order = this.ordersMap.get(orderId);
      while (order.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking status again
        order = this.ordersMap.get(orderId);
      }

      // Once the order is marked as completed, return the complete order details
      return res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getOrderStatus(req, res, next) {
    const { orderId } = req.params;
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
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

  // New method: Get products by price range
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

// New method: Get products by quantity range
async getProductsByQuantityRange(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract minQuantity and maxQuantity from the query parameters
    const { minQuantity, maxQuantity } = req.query;

    // Validate and parse the query parameters
    if (isNaN(minQuantity) || isNaN(maxQuantity)) {
      return res.status(400).json({ message: "Invalid quantity range provided" });
    }

    // Fetch products by quantity range using the service method
    const products = await this.productsService.getProductsByQuantityRange(Number(minQuantity), Number(maxQuantity));

    // Return the products in the response
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by quantity range:', error);
    res.status(500).json({ message: "Server error" });
  }
}


  // New method: Apply discount to a product
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
}

module.exports = ProductController;
