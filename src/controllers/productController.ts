import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, stock, price, vendorId, categoryId, images } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        stock,
        price,
        vendor: { connect: { id: vendorId } },
        category: { connect: { id: categoryId } }, // Ensure categoryId is passed and connected
        images: {
          create: images.map((imgUrl: string) => ({ imageUrl: imgUrl })),
        },
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Product creation failed' });
  }
};


// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    });
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, stock, price } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, stock, price },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Product update failed' });
  }
};
