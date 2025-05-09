// routes/productRoutes.js
const express = require("express");
const productController = require("../controllers/productController");
// const authMiddleware = require('../middleware/authMiddleware'); // Optional

const router = express.Router();

// Product routes
router.post("/products", productController.createProduct); // Typically requires auth (e.g., ADMIN)
router.get("/products", productController.getAllProducts);
router.get("/products/:productId", productController.getProductById);
router.put("/products/:productId", productController.updateProduct); // Typically requires auth
router.delete("/products/:productId", productController.deleteProduct); // Typically requires auth

module.exports = router;
