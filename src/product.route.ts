import express, {Request, Response} from "express"
import { PrismaClient } from "@prisma/client";
import {StatusCodes} from "http-status-codes"

const prisma = new PrismaClient();
export const productRouter = express.Router();

// Create a new product
productRouter.post("/api/products", async (req: Request, res: Response) => {
  try {
    const { name, stock, details } = req.body;

    // First, create a Detail
    const newDetail = await prisma.detail.create({
      data: {
        price: details.price,
        description: details.description,
        color: details.color
      }
    });

    // Then, create a Product with the id of the new Detail
    const newProduct = await prisma.product.create({
      data: {
        createdAt: new Date(),
        name,
        price: details.price,
        description: details.description,
        color: details.color,
        stock,
        detailId: newDetail.id
      }
    });

    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error}` });
  }
});

// Get all products
productRouter.get("/api/products", async (req: Request, res: Response) => {
  try {
    const customers = await prisma.product.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get a single product
productRouter.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const customer = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });
    let result = {
      "customer": customer,
      "orders": []
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Update a product
productRouter.put("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const customer = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete a product
productRouter.delete("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.json("Votre produit " + product.name + " a été supprimé avec succès !");
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = {
  productRouter
};