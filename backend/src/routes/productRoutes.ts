import { Router } from "express";
import { ProductController } from "../controller/ProductController";
import { verifyToken, isSeller } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createProductSchema, updateProductSchema } from "../validations";

const router = Router();
const productController = new ProductController();

router.get("/", (req, res) => productController.getAllProducts(req, res));
router.get("/:id", (req, res) => productController.getProductById(req, res));

// Protected route: Only authenticated SELLERs or SUPER_ADMINs can create a product
router.post(
  "/", 
  verifyToken, 
  isSeller, 
  validate(createProductSchema), 
  (req, res) => productController.createProduct(req, res)
);

router.get(
  "/seller/:sellerId",
  verifyToken,
  (req, res) => productController.getSellerProducts(req, res)
);

router.put(
  "/:id",
  verifyToken,
  isSeller,
  validate(updateProductSchema),
  (req, res) => productController.updateProduct(req, res)
);

router.delete(
  "/:id",
  verifyToken,
  isSeller,
  (req, res) => productController.deleteProduct(req, res)
);

export default router;
