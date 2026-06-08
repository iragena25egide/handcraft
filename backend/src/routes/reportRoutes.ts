import { Router } from "express";
import { ReportController } from "../controller/ReportController";
import { verifyToken, isSuperAdmin } from "../middleware/auth";

const router = Router();
const reportController = new ReportController();

router.get("/sales", verifyToken, isSuperAdmin, (req, res) =>
  reportController.getSalesRevenue(req, res)
);
router.get("/low-stock", verifyToken, isSuperAdmin, (req, res) =>
  reportController.getLowStockProducts(req, res)
);

router.get("/pdf", verifyToken, (req, res) =>
  reportController.generatePdfReport(req as any, res)
);

export default router;
