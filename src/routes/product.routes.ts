import express from "express";
import * as productController from "../controllers/product.controller";

const productRouter = express.Router();

productRouter.post("/api/products", productController.createProduct);
productRouter.get("/api/products", productController.getAllProducts);
productRouter.get("/api/products/:id", productController.getProductById);
productRouter.put("/api/products/:id", productController.updateProduct);
productRouter.delete("/api/products/:id", productController.deleteProduct);

export default productRouter;
