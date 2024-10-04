import { Request, Response } from 'express';
import prisma from '../prisma';


  
  // Get all addresses for a specific user
  export const getAddressesForUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
  
    try {
      const addresses = await prisma.address.findMany({
        where: { userId: Number(userId) },
      });
  
      if (!addresses.length) {
        res.status(404).json({ error: 'No addresses found for this user' });
        return;
      }
  
      res.json(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ error: 'Failed to fetch addresses' });
    }
  };

// Get all addresses
export const getAllAddresses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const addresses = await prisma.address.findMany();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// Get address by ID
export const getAddressById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(address);
  } catch (error) {
    res.status(404).json({ error: 'Address not found' });
  }
};

// Create address
export const createAddress = async (req: Request, res: Response): Promise<void> => {
  const { postalCode, userId } = req.body;
  try {
    const newAddress = await prisma.address.create({
      data: {
        postalCode,
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create address' });
  }
};
