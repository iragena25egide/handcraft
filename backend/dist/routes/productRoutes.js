"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controller/ProductController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
const productController = new ProductController_1.ProductController();
router.get("/", (req, res) => productController.getAllProducts(req, res));
router.get("/:id", (req, res) => productController.getProductById(req, res));
// Protected route: Only authenticated SELLERs or SUPER_ADMINs can create a product
router.post("/", auth_1.verifyToken, auth_1.isSeller, (0, validate_1.validate)(validations_1.createProductSchema), (req, res) => productController.createProduct(req, res));
router.get("/seller/:sellerId", auth_1.verifyToken, (req, res) => productController.getSellerProducts(req, res));
router.put("/:id", auth_1.verifyToken, auth_1.isSeller, (0, validate_1.validate)(validations_1.updateProductSchema), (req, res) => productController.updateProduct(req, res));
router.delete("/:id", auth_1.verifyToken, auth_1.isSeller, (req, res) => productController.deleteProduct(req, res));
exports.default = router;
