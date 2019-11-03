const express = require('express');
const router = express.Router();

// Handle orders controllers router
const ordersController = require("../controllers/orders");


router.get("/", ordersController.getOrders); // Get all the orders

router.post("/", ordersController.postOrders); // Create orders

router.get("/:id", ordersController.getOrderId); // Get single ordere
 
router.delete("/:id", ordersController.deleteOrderId); // Delete Order

module.exports = router;