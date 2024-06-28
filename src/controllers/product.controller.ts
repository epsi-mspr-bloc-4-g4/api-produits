import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { produceMessage } from "../../kafka/producer";

const prisma = new PrismaClient();

// Création d'un nouveau produit
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, stock, price, description, color } = req.body;


    // Then, create a Product with the id of the new Detail
    const newProduct = await prisma.product.create({
      data: {
        createdAt: new Date(),
        name: name,
        stock: stock,
        details: {
             create:{
                price: price,
                description:description,
                color: color
                }
          }
        },
    });

    res.json("Votre produit avec l'id" + + newProduct.id + "a bien été créé ");
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error}` });
  }
};

// Récupération de tous les produits
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        details: true,
      },
    });
    await produceMessage("order-products-fetch", products);
    console.log(produceMessage("order-products-fetch", products))
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Récupération d'un seul produit
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        details: true,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Mise à jour d'un produit
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: {
        details: true,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Suppression d'un produit
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.json("Votre produit " + product.name + " a été supprimé avec succès !");
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
