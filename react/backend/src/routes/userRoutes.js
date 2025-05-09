// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
// const authMiddleware = require('../middleware/authMiddleware'); // Optional: for protecting routes

const router = express.Router();

// User/Auth routes
router.post("/users", userController.signup);

router.get("/users", userController.getAllUsers); // Potentially admin only
router.get("/users/:userId", userController.getUserById); // Potentially admin or self
router.put("/users/:userId", userController.updateUser); // Potentially admin or self
router.delete("/users/:userId", userController.deleteUser); // Potentially admin only

module.exports = router;
