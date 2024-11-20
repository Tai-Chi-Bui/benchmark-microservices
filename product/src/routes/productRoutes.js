const express = require("express");
const ProductController = require("../controllers/productController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const productController = new ProductController();

// Debugging: Log to ensure methods exist
console.log(productController.getProducts);
console.log(productController.createProduct);
console.log(productController.getProductById);

// Fetch all products
router.get("/", isAuthenticated, productController.getProducts);

// Create a new product
router.post("/", isAuthenticated, productController.createProduct);

// Fetch a single product by ID
router.get("/:productId", isAuthenticated, productController.getProductById);

// Fetch products by price range
router.get("/price-range", isAuthenticated, productController.getProductsByPriceRange);

// Apply discount to a product
router.post("/discount", isAuthenticated, productController.applyDiscountToProduct);

module.exports = router;
