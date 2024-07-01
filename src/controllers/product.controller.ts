import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { produceMessage } from "../../kafka/producer";

const prisma = new PrismaClient();

type InputProductWithDetail = {
  name: string;
  stock: number;
  price: string;
  description: string;
  color: string;
};
// Création d'un nouveau produit
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, stock, price, description, color }: InputProductWithDetail =
      req.body;

    // Then, create a Product with the id of the new Detail
    const newProduct = await prisma.product.create({
      data: {
        createdAt: new Date(),
        name: name,
        stock: stock,
        details: {
          create: {
            price: price,
            description: description,
            color: color,
          },
        },
      },
    });

    const productsToKafka = await prisma.product.findMany({
      include: {
        details: true,
      },
    });

    if (productsToKafka.length > 0) {
      await produceMessage("order-products-fetch", productsToKafka);
    }

    res.json(
      "Votre produit avec l'id " +
        newProduct.id +
        " a bien été créé. " +
        newProduct.name
    );
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error}` });
  }
};

// Création de plusieurs produits
export const createProducts = async (req: Request, res: Response) => {
  try {
    const products: InputProductWithDetail[] = req.body;

    const createManyProducts = products.map((product) => {
      return prisma.product.create({
        data: {
          createdAt: new Date(),
          name: product.name,
          stock: product.stock,
          details: {
            create: {
              price: product.price,
              description: product.description,
              color: product.color,
            },
          },
        },
      });
    });

    Promise.all(createManyProducts);

    const productsToKafka = await prisma.product.findMany({
      include: {
        details: true,
      },
    });

    if (productsToKafka.length > 0) {
      await produceMessage("order-products-fetch", productsToKafka);
    }

    res.json("Vos produits ont bien été créés.");
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

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong : " + error });
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
    const product: InputProductWithDetail = req.body;

    await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        name: product.name,
        stock: product.stock,
        details: {
          update: {
            price: product.price,
            description: product.description,
            color: product.color,
          },
        },
      },
    });

    const productsToKafka = await prisma.product.findMany({
      include: {
        details: true,
      },
    });

    if (productsToKafka.length > 0) {
      await produceMessage("order-products-fetch", productsToKafka);
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong " + error });
  }
};

// Suppression d'un produit
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });

    const productsToKafka = await prisma.product.findMany({
      include: {
        details: true,
      },
    });

    if (productsToKafka.length > 0) {
      await produceMessage("order-products-fetch", productsToKafka);
    }

    res.json("Votre produit " + product.name + " a été supprimé avec succès !");
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
