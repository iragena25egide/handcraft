"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controller/UserController");
const validate_1 = require("../middleware/validate");
const validations_1 = require("../validations");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.post("/register", (0, validate_1.validate)(validations_1.registerSchema), (req, res) => userController.register(req, res));
router.post("/login", (0, validate_1.validate)(validations_1.loginSchema), (req, res) => userController.login(req, res));
// Example of a protected route to get current user profile
router.get("/me", auth_1.verifyToken, (req, res) => {
    res.json(req.user);
});
exports.default = router;
