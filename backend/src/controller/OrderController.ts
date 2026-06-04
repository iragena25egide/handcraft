import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { Product } from "../entity/Product";
import { AuthRequest } from "../middleware/auth";
import { getIo } from "../socket";

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);

  async createOrder(req: AuthRequest, res: Response) {
    // Start a transaction to ensure database integrity during stock decrement
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { items, guestName, guestPhone } = req.body;
      const user = req.user;

      if (!user && (!guestName || !guestPhone)) {
        return res.status(400).json({ message: "Guest checkout requires name and phone number" });
      }

      let total = 0;
      const orderItemsToSave: OrderItem[] = [];
      const sellerIdsToNotify = new Set<number>();

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { 
          where: { id: item.productId },
          relations: ["seller"],
          lock: { mode: "pessimistic_write" } // Lock the row to prevent race conditions during checkout
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Decrement stock (Stock Out)
        product.stockQuantity -= item.quantity;
        await queryRunner.manager.save(product);

        // Calculate order total
        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        // Create OrderItem
        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        orderItem.priceAtPurchase = product.price;
        orderItemsToSave.push(orderItem);

        if (product.seller) {
          sellerIdsToNotify.add(product.seller.id);
        }
      }

      // Create Order
      const order = new Order();
      if (user) {
        order.user = user;
      } else {
        order.guestName = guestName;
        order.guestPhone = guestPhone;
      }
      order.total = total;
      order.status = "Processing";
      order.items = orderItemsToSave;

      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();

      // Emit realtime notifications
      try {
        const io = getIo();
        io.to("room:admin").emit("new_order", { message: "A new order was placed!", orderId: savedOrder.id, total: savedOrder.total });
        sellerIdsToNotify.forEach(sellerId => {
          io.to(`room:seller_${sellerId}`).emit("new_order", { message: "One of your products was ordered!", orderId: savedOrder.id });
        });
      } catch (e) {
        console.error("Socket emit failed", e);
      }

      res.status(201).json(savedOrder);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      res.status(400).json({ message: error.message || "Error creating order" });
    } finally {
      await queryRunner.release();
    }
  }

  async getUserOrders(req: AuthRequest, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      
      // Ensure users can only fetch their own orders, unless Super Admin
      if (req.user?.id !== userId && req.user?.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const orders = await this.orderRepository.find({
        where: { user: { id: userId } },
        relations: ["items", "items.product"],
        order: { createdAt: "DESC" }
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error });
    }
  }
}
