import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, stock, price, vendorId, categoryId, unitId, images } = req.body;

  try {
    // Check if vendor exists
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      res.status(404).json({ error: 'Vendor not found' });
      return;
    }

    // Check if unit exists (optional, for validation purposes)
    const unit = await prisma.unitOfMeasure.findUnique({
      where: { id: unitId },  // Ensure unitId is passed correctly
    });

    if (!unit) {
      res.status(404).json({ error: 'Unit of Measure not found' });
      return;
    }

    // Proceed with product creation if vendor and unit exist
    const product = await prisma.product.create({
      data: {
        name,
        stock,
        price,
        vendor: { connect: { id: vendorId } },
        category: { connect: { id: categoryId } },
        unit: { connect: { id: unitId } },  // Connect the unitId here
        images: images ? {
          create: images.map((imgUrl: string) => ({ imageUrl: imgUrl })),
        } : undefined,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Product creation failed:", error);
    res.status(500).json({ error: 'Product creation failed', details: error });
  }
};


// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, unit: true },  // Include unit in the response
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
      include: { images: true, unit: true },  // Include unit in the response
    });
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Product not found' });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, stock, price, unitId } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, stock, price, unit: { connect: { id: unitId } } },  // Connect unit if provided
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Product update failed' });
  }
};
