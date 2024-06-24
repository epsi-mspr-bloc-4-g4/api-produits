import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Création d'un nouveau produit
export const createProduct = async (req: Request, res: Response) => {
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
    };

// Récupération de tous les produits
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const customers = await prisma.product.findMany();
        res.json(customers);
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
      }
    };

// Récupération d'un seul produit
export const getProductById = async (req: Request, res: Response) => {
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
    };

// Mise à jour d'un produit
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const customer = await prisma.product.update({
          where: { id: Number(req.params.id) },
          data: req.body,
        });
        res.json(customer);
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
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
        res.status(500).json({ error: 'Something went wrong' });
      }
    };

/* À IMPLEMENTER 

  // Récupération des commandes d'un client spécifique
export const getOrdersByCustomerId = async (req: Request, res: Response) => {
  try {
    const customerId = Number(req.params.customerId);
    const orders = []; // await prisma.order.findMany({ where: { customerId } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Récupération d'une commande spécifique d'un client
export const getOrderByIdAndCustomerId = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = []; // await prisma.order.findUnique({ where: { id: orderId } });
    // Vérifier si la commande appartient au client spécifié
    // if (order && order.customerId === Number(req.params.customerId)) {
    //   res.json(order);
    // } else {
    //   res.status(404).json({ error: 'Order not found' });
    // }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Récupération des produits d'une commande spécifique d'un client
export const getProductsByOrderIdAndCustomerId = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const products = []; // await prisma.order.findUnique({ where: { id: orderId } }).product();
    // Vérifier si la commande appartient au client spécifié
    // if (order && order.customerId === Number(req.params.customerId)) {
    //   res.json(products);
    // } else {
    //   res.status(404).json({ error: 'Order not found' });
    // }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
*/