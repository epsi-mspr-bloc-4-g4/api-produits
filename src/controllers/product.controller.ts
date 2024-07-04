import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { produceMessage } from "../kafka/producer";

const prisma = new PrismaClient();

type InputProductWithDetail = {
  id?: number;
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
    const existingProduct = await prisma.product.findFirst({
      where: { name: name },
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Ce produit avec ce nom existe déjà." });
    }

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
    const reqProducts: InputProductWithDetail[] = req.body;

    const reqProductsIds = reqProducts.filter((reqProduct) => reqProduct.id);
    const reqProductsNoIds = reqProducts.filter((reqProduct) => !reqProduct.id);

    const existingProducts = await prisma.product.findMany();

    await prisma.$transaction(
      reqProductsNoIds
        .filter((reqProductNoId) => {
          const existingProduct = existingProducts.find(
            (existingProduct) => existingProduct.name === reqProductNoId.name
          );
          return !existingProduct;
        })
        .map((reqProductNoId) => {
          return prisma.product.create({
            data: {
              createdAt: new Date(),
              name: reqProductNoId.name,
              stock: reqProductNoId.stock,
              details: {
                create: {
                  price: reqProductNoId.price,
                  description: reqProductNoId.description,
                  color: reqProductNoId.color,
                },
              },
            },
          });
        })
    );

    await prisma.$transaction(
      reqProductsIds
        .filter((reqProductId) => {
          const existingProduct = existingProducts.find(
            (existingProduct) => existingProduct.id === reqProductId.id
          );
          return existingProduct;
        })
        .map((reqProductId) => {
          return prisma.product.update({
            where: { id: reqProductId.id },
            data: {
              stock: reqProductId.stock,
              details: {
                update: {
                  price: reqProductId.price,
                  description: reqProductId.description,
                  color: reqProductId.color,
                },
              },
            },
          });
        })
    );

    await prisma.$transaction(
      reqProductsIds
        .filter((reqProduct) => {
          const notExistingProduct = existingProducts.find(
            (existingProduct) => {
              existingProduct.id !== reqProduct.id &&
                existingProduct.name !== reqProduct.name;
            }
          );
          return notExistingProduct;
        })
        .map((reqProduct) => {
          return prisma.product.create({
            data: {
              createdAt: new Date(),
              name: reqProduct.name,
              stock: reqProduct.stock,
              details: {
                create: {
                  price: reqProduct.price,
                  description: reqProduct.description,
                  color: reqProduct.color,
                },
              },
            },
          });
        })
    );

    // await prisma.$transaction(
    //   reqProducts.map((reqProduct) => {
    //     const existingProduct = existingProducts.find(
    //       (existingProduct) =>
    //         existingProduct.id === reqProduct.id ||
    //         existingProduct.name === reqProduct.name
    //     );

    //     if (existingProduct) {
    //       return prisma.product.update({
    //         where: { id: existingProduct.id },
    //         data: {
    //           stock: reqProduct.stock,
    //           details: {
    //             update: {
    //               price: reqProduct.price,
    //               description: reqProduct.description,
    //               color: reqProduct.color,
    //             },
    //           },
    //         },
    //       });
    //     }

    //     return prisma.product.create({
    //       data: {
    //         createdAt: new Date(),
    //         name: reqProduct.name,
    //         stock: reqProduct.stock,
    //         details: {
    //           create: {
    //             price: reqProduct.price,
    //             description: reqProduct.description,
    //             color: reqProduct.color,
    //           },
    //         },
    //       },
    //     });
    //   })
    // );

    const productsToKafka = await prisma.product.findMany({
      include: {
        details: true,
      },
    });

    Promise.all(productsToKafka);

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
