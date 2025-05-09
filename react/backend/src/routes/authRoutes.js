const express = require("express");
const router = express.Router()
const authController = require("../controllers/authControllers")

router.post("/signup", authController.signup)

module.exports = router