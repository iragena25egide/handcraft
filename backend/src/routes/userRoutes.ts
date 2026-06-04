import { Router } from "express";
import { UserController } from "../controller/UserController";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validations";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();
const userController = new UserController();

router.post("/register", validate(registerSchema), (req, res) => userController.register(req, res));
router.post("/login", validate(loginSchema), (req, res) => userController.login(req, res));

// Example of a protected route to get current user profile
router.get("/me", verifyToken, (req: AuthRequest, res) => {
  res.json(req.user);
});

export default router;
