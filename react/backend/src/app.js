// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("./config/db"); // This should ideally export the db object or ensure it's globally available if not passed.

// Import Routers
const userRoutes = require("./routes/userRoutes"); // Renamed from authRoutes for clarity
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to the Inventory Management API 🚀");
});

// API Routes
app.use("/api", userRoutes); // All user-related routes will be prefixed with /api
app.use("/api", productRoutes); // All product-related routes will be prefixed with /api
app.use("/api", stockRoutes); // All stock-related routes will be prefixed with /api

// Basic Error Handling Middleware (optional, can be more sophisticated)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!', error: err.message });
});


// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
