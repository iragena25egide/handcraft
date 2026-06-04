import { Router } from "express";
import { ReportController } from "../controller/ReportController";
import { verifyToken, isSuperAdmin } from "../middleware/auth";

const router = Router();
const reportController = new ReportController();

// Only Super Admins can access reports
router.get("/sales", verifyToken, isSuperAdmin, (req, res) => reportController.getSalesRevenue(req, res));
router.get("/low-stock", verifyToken, isSuperAdmin, (req, res) => reportController.getLowStockProducts(req, res));

// Both SELLER and SUPER_ADMIN can access their PDF report
router.get("/pdf", verifyToken, (req, res) => reportController.generatePdfReport(req as any, res));

export default router;
