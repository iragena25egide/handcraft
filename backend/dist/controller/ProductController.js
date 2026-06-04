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
exports.ProductController = void 0;
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
class ProductController {
    constructor() {
        this.productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
    }
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.productRepository.find({ relations: ["seller"] });
                res.json(products);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching products", error });
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const product = yield this.productRepository.findOne({ where: { id }, relations: ["seller"] });
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }
                res.json(product);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching product", error });
            }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // The user is attached by the verifyToken middleware
                const seller = req.user;
                if (!seller) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const productData = Object.assign(Object.assign({}, req.body), { seller });
                const product = this.productRepository.create(productData);
                const results = yield this.productRepository.save(product);
                res.status(201).json(results);
            }
            catch (error) {
                res.status(500).json({ message: "Error creating product", error });
            }
        });
    }
    getSellerProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const sellerId = parseInt(req.params.sellerId);
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== sellerId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "SUPER_ADMIN") {
                    return res.status(403).json({ message: "Forbidden" });
                }
                const products = yield this.productRepository.find({
                    where: { seller: { id: sellerId } },
                    order: { createdAt: "DESC" }
                });
                res.json(products);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching seller products", error });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const id = parseInt(req.params.id);
                const product = yield this.productRepository.findOne({ where: { id }, relations: ["seller"] });
                if (!product)
                    return res.status(404).json({ message: "Product not found" });
                if (((_a = product.seller) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== "SUPER_ADMIN") {
                    return res.status(403).json({ message: "Forbidden" });
                }
                this.productRepository.merge(product, req.body);
                const results = yield this.productRepository.save(product);
                res.json(results);
            }
            catch (error) {
                res.status(500).json({ message: "Error updating product", error });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const id = parseInt(req.params.id);
                const product = yield this.productRepository.findOne({ where: { id }, relations: ["seller"] });
                if (!product)
                    return res.status(404).json({ message: "Product not found" });
                if (((_a = product.seller) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== "SUPER_ADMIN") {
                    return res.status(403).json({ message: "Forbidden" });
                }
                yield this.productRepository.delete(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: "Error deleting product", error });
            }
        });
    }
}
exports.ProductController = ProductController;
