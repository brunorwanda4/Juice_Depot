// routes/stockRoutes.js
const express = require("express");
const stockController = require("../controllers/stockController");
// const authMiddleware = require('../middleware/authMiddleware'); // Optional

const router = express.Router();

// Stock In routes
router.post("/stock/in", stockController.createStockIn); // Typically requires auth
router.get("/stock/in", stockController.getAllStockInRecords);
router.get("/stock/in/:stockInId", stockController.getStockInById);
router.put("/stock/in/:stockInId", stockController.updateStockIn); // Typically requires auth
router.delete("/stock/in/:stockInId", stockController.deleteStockIn); // Typically requires auth


// Stock Out routes
router.post("/stock/out", stockController.createStockOut); // Typically requires auth
router.get("/stock/out", stockController.getAllStockOutRecords);
router.get("/stock/out/:stockOutId", stockController.getStockOutById);
router.put("/stock/out/:stockOutId", stockController.updateStockOut); // Typically requires auth
router.delete("/stock/out/:stockOutId", stockController.deleteStockOut); // Typically requires auth

module.exports = router;
