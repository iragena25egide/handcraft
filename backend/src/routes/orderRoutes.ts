import { Router } from "express";
import { OrderController } from "../controller/OrderController";
import { verifyToken, optionalAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createOrderSchema } from "../validations";

const router = Router();
const orderController = new OrderController();

// Guests and authenticated users can place an order
router.post(
  "/", 
  optionalAuth, 
  validate(createOrderSchema), 
  (req, res) => orderController.createOrder(req, res)
);

// Only authenticated users can view orders
router.get(
  "/user/:userId", 
  verifyToken, 
  (req, res) => orderController.getUserOrders(req, res)
);

export default router;
