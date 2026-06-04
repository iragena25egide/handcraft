"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const data_source_1 = require("../data-source");
const Order_1 = require("../entity/Order");
const OrderItem_1 = require("../entity/OrderItem");
const Product_1 = require("../entity/Product");
const socket_1 = require("../socket");
class OrderController {
    constructor() {
        this.orderRepository = data_source_1.AppDataSource.getRepository(Order_1.Order);
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a transaction to ensure database integrity during stock decrement
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const { items, guestName, guestPhone } = req.body;
                const user = req.user;
                if (!user && (!guestName || !guestPhone)) {
                    return res.status(400).json({ message: "Guest checkout requires name and phone number" });
                }
                let total = 0;
                const orderItemsToSave = [];
                const sellerIdsToNotify = new Set();
                for (const item of items) {
                    const product = yield queryRunner.manager.findOne(Product_1.Product, {
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
                    yield queryRunner.manager.save(product);
                    // Calculate order total
                    const itemTotal = product.price * item.quantity;
                    total += itemTotal;
                    // Create OrderItem
                    const orderItem = new OrderItem_1.OrderItem();
                    orderItem.product = product;
                    orderItem.quantity = item.quantity;
                    orderItem.priceAtPurchase = product.price;
                    orderItemsToSave.push(orderItem);
                    if (product.seller) {
                        sellerIdsToNotify.add(product.seller.id);
                    }
                }
                // Create Order
                const order = new Order_1.Order();
                if (user) {
                    order.user = user;
                }
                else {
                    order.guestName = guestName;
                    order.guestPhone = guestPhone;
                }
                order.total = total;
                order.status = "Processing";
                order.items = orderItemsToSave;
                const savedOrder = yield queryRunner.manager.save(Order_1.Order, order);
                yield queryRunner.commitTransaction();
                // Emit realtime notifications
                try {
                    const io = (0, socket_1.getIo)();
                    io.to("room:admin").emit("new_order", { message: "A new order was placed!", orderId: savedOrder.id, total: savedOrder.total });
                    sellerIdsToNotify.forEach(sellerId => {
                        io.to(`room:seller_${sellerId}`).emit("new_order", { message: "One of your products was ordered!", orderId: savedOrder.id });
                    });
                }
                catch (e) {
                    console.error("Socket emit failed", e);
                }
                res.status(201).json(savedOrder);
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                res.status(400).json({ message: error.message || "Error creating order" });
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    getUserOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = parseInt(req.params.userId);
                // Ensure users can only fetch their own orders, unless Super Admin
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "SUPER_ADMIN") {
                    return res.status(403).json({ message: "Forbidden" });
                }
                const orders = yield this.orderRepository.find({
                    where: { user: { id: userId } },
                    relations: ["items", "items.product"],
                    order: { createdAt: "DESC" }
                });
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching orders", error });
            }
        });
    }
}
exports.OrderController = OrderController;
