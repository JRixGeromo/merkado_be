import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new product category
export const createProductCategory = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  try {
    const productCategory = await prisma.productCategory.create({
      data: {
        name,
      },
    });
    res.status(201).json(productCategory);
  } catch (error) {
    console.error('Error creating product category:', error);
    res.status(500).json({ error: 'Failed to create product category' });
  }
};

// Get a single product category by ID
export const getProductCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const productCategory = await prisma.productCategory.findUnique({
      where: { id: Number(id) },
    });

    if (!productCategory) {
      res.status(404).json({ error: 'Product category not found' });
      return;
    }

    res.json(productCategory);
  } catch (error) {
    console.error('Error fetching product category:', error);
    res.status(500).json({ error: 'Failed to fetch product category' });
  }
};

// Get all product categories
export const getAllProductCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const productCategories = await prisma.productCategory.findMany();
    res.json(productCategories);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ error: 'Failed to fetch product categories' });
  }
};

// Update a product category
export const updateProductCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedProductCategory = await prisma.productCategory.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.json(updatedProductCategory);
  } catch (error) {
    console.error('Error updating product category:', error);
    res.status(500).json({ error: 'Failed to update product category' });
  }
};

// Delete a product category
export const deleteProductCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.productCategory.delete({
      where: { id: Number(id) },
    });

    res.status(204).json({ message: 'Product category deleted' });
  } catch (error) {
    console.error('Error deleting product category:', error);
    res.status(500).json({ error: 'Failed to delete product category' });
  }
};
