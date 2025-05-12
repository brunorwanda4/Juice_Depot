// controllers/productController.js
const db = require("../config/db");

// Create a new product
exports.createProduct = (req, res) => {
  const { productName, buyUnitPrice, sellUnitPrice } = req.body;

  if (
    !productID ||
    !productName ||
    buyUnitPrice === undefined ||
    sellUnitPrice === undefined
  ) {
    return res.status(400).json({
      message: " productName, buyUnitPrice, and sellUnitPrice are required.",
    });
  }
  if (isNaN(parseFloat(buyUnitPrice)) || isNaN(parseFloat(sellUnitPrice))) {
    return res.status(400).json({ message: "Prices must be valid numbers." });
  }
  if (
    parseInt(productID) <= 0 ||
    parseFloat(buyUnitPrice) < 0 ||
    parseFloat(sellUnitPrice) < 0
  ) {
    return res
      .status(400)
      .json({ message: "Product ID and prices must be positive values." });
  }

  db.query(
    "INSERT INTO Products ( productName, buyUnitPrice, sellUnitPrice) VALUES (?, ?, ?, ?)",
    [productName, parseFloat(buyUnitPrice), parseFloat(sellUnitPrice)],
    (err, result) => {
      if (err) {
        // Check for duplicate productID error (MySQL error code 1062)
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json({
              message: "Product ID already exists.",
              error: err.message,
            });
        }
        console.error("Database error creating product:", err);
        return res
          .status(500)
          .json({ message: "Failed to create product.", error: err.message });
      }
      res.status(201).json({
        message: "Product created successfully.",
        productID: result.insertId, // As productID is not auto-incremented
      });
    }
  );
};

// Get all products
exports.getAllProducts = (req, res) => {
  db.query("SELECT * FROM Products", (err, results) => {
    if (err) {
      console.error("Database error fetching products:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch products.", error: err.message });
    }
    res.status(200).json(results);
  });
};

// Get product by ID
exports.getProductById = (req, res) => {
  const { productId } = req.params;
  db.query(
    "SELECT * FROM Products WHERE productID = ?",
    [productId],
    (err, results) => {
      if (err) {
        console.error("Database error fetching product:", err);
        return res
          .status(500)
          .json({ message: "Failed to fetch product.", error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Update a product
exports.updateProduct = (req, res) => {
  const { productId } = req.params;
  const { productName, buyUnitPrice, sellUnitPrice } = req.body;

  if (
    !productName &&
    buyUnitPrice === undefined &&
    sellUnitPrice === undefined
  ) {
    return res.status(400).json({ message: "No fields to update provided." });
  }

  let query = "UPDATE Products SET ";
  const queryParams = [];
  const fieldsToUpdate = [];

  if (productName) {
    fieldsToUpdate.push("productName = ?");
    queryParams.push(productName);
  }
  if (buyUnitPrice !== undefined) {
    if (isNaN(parseFloat(buyUnitPrice)) || parseFloat(buyUnitPrice) < 0) {
      return res
        .status(400)
        .json({ message: "Buy unit price must be a non-negative number." });
    }
    fieldsToUpdate.push("buyUnitPrice = ?");
    queryParams.push(parseFloat(buyUnitPrice));
  }
  if (sellUnitPrice !== undefined) {
    if (isNaN(parseFloat(sellUnitPrice)) || parseFloat(sellUnitPrice) < 0) {
      return res
        .status(400)
        .json({ message: "Sell unit price must be a non-negative number." });
    }
    fieldsToUpdate.push("sellUnitPrice = ?");
    queryParams.push(parseFloat(sellUnitPrice));
  }

  if (fieldsToUpdate.length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields to update provided." });
  }

  query += fieldsToUpdate.join(", ") + " WHERE productID = ?";
  queryParams.push(productId);

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Database error updating product:", err);
      return res
        .status(500)
        .json({ message: "Failed to update product.", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or no changes made." });
    }
    res.status(200).json({ message: "Product updated successfully." });
  });
};

// Delete a product
exports.deleteProduct = (req, res) => {
  const { productId } = req.params;

  // Optional: Check if product is used in Stock_In or Stock_Out before deleting
  // This would require additional queries and logic.
  // For simplicity, direct deletion is implemented here.

  db.query(
    "DELETE FROM Products WHERE productID = ?",
    [productId],
    (err, result) => {
      if (err) {
        // Handle foreign key constraint errors (e.g., if product is in stock tables)
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
          return res.status(409).json({
            message:
              "Cannot delete product. It is referenced in stock records. Please delete related stock entries first.",
            error: err.message,
          });
        }
        console.error("Database error deleting product:", err);
        return res
          .status(500)
          .json({ message: "Failed to delete product.", error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.status(200).json({ message: "Product deleted successfully." });
    }
  );
};
