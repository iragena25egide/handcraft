"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controller/OrderController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
const orderController = new OrderController_1.OrderController();
// Guests and authenticated users can place an order
router.post("/", auth_1.optionalAuth, (0, validate_1.validate)(validations_1.createOrderSchema), (req, res) => orderController.createOrder(req, res));
// Only authenticated users can view orders
router.get("/user/:userId", auth_1.verifyToken, (req, res) => orderController.getUserOrders(req, res));
exports.default = router;
