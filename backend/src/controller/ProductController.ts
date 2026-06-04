import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { AuthRequest } from "../middleware/auth";

export class ProductController {
  private productRepository = AppDataSource.getRepository(Product);

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productRepository.find({ relations: ["seller"] });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productRepository.findOne({ where: { id }, relations: ["seller"] });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product", error });
    }
  }

  async createProduct(req: AuthRequest, res: Response) {
    try {
      // The user is attached by the verifyToken middleware
      const seller = req.user;
      
      if (!seller) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const productData = { ...req.body, seller };
      const product = this.productRepository.create(productData);
      const results = await this.productRepository.save(product);
      res.status(201).json(results);
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error });
    }
  }

  async getSellerProducts(req: AuthRequest, res: Response) {
    try {
      const sellerId = parseInt(req.params.sellerId);
      
      if (req.user?.id !== sellerId && req.user?.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const products = await this.productRepository.find({
        where: { seller: { id: sellerId } },
        order: { createdAt: "DESC" }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching seller products", error });
    }
  }

  async updateProduct(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productRepository.findOne({ where: { id }, relations: ["seller"] });
      
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (product.seller?.id !== req.user?.id && req.user?.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
      }

      this.productRepository.merge(product, req.body);
      const results = await this.productRepository.save(product);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error });
    }
  }

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productRepository.findOne({ where: { id }, relations: ["seller"] });
      
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (product.seller?.id !== req.user?.id && req.user?.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
      }

      await this.productRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  }
}
