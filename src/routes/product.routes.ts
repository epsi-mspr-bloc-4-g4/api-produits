import express from "express";
import * as productController from "../controllers/product.controller";
import { errorHandler } from "../middlewares/errorHandler";

const productRouter = express.Router();

productRouter.post(
  "/api/products",
  errorHandler,
  productController.createProduct
);
productRouter.post(
  "/api/products/bulk",
  errorHandler,
  productController.createProducts
);
productRouter.get(
  "/api/products",
  errorHandler,
  productController.getAllProducts
);
productRouter.get("/api/products/:id", productController.getProductById);
productRouter.put("/api/products/:id", productController.updateProduct);
productRouter.delete("/api/products/:id", productController.deleteProduct);

export default productRouter;
