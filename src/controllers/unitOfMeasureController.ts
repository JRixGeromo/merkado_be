import { Request, Response } from 'express';
import prisma from '../prisma';

// Get all units of measure
export const getAllUnitsOfMeasure = async (_req: Request, res: Response): Promise<void> => {
  try {
    const units = await prisma.unitOfMeasure.findMany();
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Failed to fetch units of measure' });
  }
};

// Get unit of measure by ID
export const getUnitOfMeasureById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const unit = await prisma.unitOfMeasure.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: 'Unit of measure not found' });
  }
};

// Create unit of measure
export const createUnitOfMeasure = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  try {
    const newUnit = await prisma.unitOfMeasure.create({
      data: { name },
    });
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create unit of measure' });
  }
};

// Delete unit of measure
export const deleteUnitOfMeasure = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.unitOfMeasure.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).json({ message: 'Unit of measure deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete unit of measure' });
  }
};
