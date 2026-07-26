import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductRequest } from "../entity/ProductRequest";

const router = Router();

// GET all requests
router.get("/", async (req: Request, res: Response) => {
  try {
    const requestRepo = AppDataSource.getRepository(ProductRequest);
    const requests = await requestRepo.find({
      order: { createdAt: "DESC" },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

// POST new request
router.post("/", async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, customerEmail, productId, productName } = req.body;
    
    if (!customerName || !customerPhone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const requestRepo = AppDataSource.getRepository(ProductRequest);
    
    const newRequest = requestRepo.create({
      customerName,
      customerPhone,
      customerEmail,
      productId,
      productName,
    });
    
    const savedRequest = await requestRepo.save(newRequest);
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to create request" });
  }
});

// PATCH update status
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const requestRepo = AppDataSource.getRepository(ProductRequest);
    const productReq = await requestRepo.findOneBy({ id });
    
    if (!productReq) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    productReq.status = status;
    await requestRepo.save(productReq);
    
    res.json(productReq);
  } catch (error) {
    res.status(500).json({ message: "Failed to update request status" });
  }
});

export default router;
