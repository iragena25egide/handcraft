"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReportController_1 = require("../controller/ReportController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const reportController = new ReportController_1.ReportController();
// Only Super Admins can access reports
router.get("/sales", auth_1.verifyToken, auth_1.isSuperAdmin, (req, res) => reportController.getSalesRevenue(req, res));
router.get("/low-stock", auth_1.verifyToken, auth_1.isSuperAdmin, (req, res) => reportController.getLowStockProducts(req, res));
// Both SELLER and SUPER_ADMIN can access their PDF report
router.get("/pdf", auth_1.verifyToken, (req, res) => reportController.generatePdfReport(req, res));
exports.default = router;
