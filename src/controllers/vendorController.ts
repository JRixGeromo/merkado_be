import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new vendor
export const createVendor = async (req: Request, res: Response): Promise<void> => {
  const { userId, location } = req.body;

  try {
    // Check if the user already has a vendor profile
    const existingVendor = await prisma.vendorProfile.findUnique({
      where: { userId: userId },
    });

    if (existingVendor) {
      res.status(400).json({ error: 'This user already has a vendor profile' });
      return;
    }

    // Proceed with vendor creation
    const vendor = await prisma.vendorProfile.create({
      data: {
        user: { connect: { id: userId } },  // Connect the user with the vendor profile
        location,
      },
    });

    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor', details: error });
  }
};

// Get a single vendor by ID
export const getVendor = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: Number(id) },
    });

    if (!vendor) {
      res.status(404).json({ error: 'Vendor not found' });
      return;
    }

    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
};

// Get all vendors
export const getAllVendors = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendors = await prisma.vendorProfile.findMany();
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};

// Update a vendor
export const updateVendor = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { location } = req.body;

  try {
    const updatedVendor = await prisma.vendorProfile.update({
      where: { id: Number(id) },
      data: { location },
    });

    res.json(updatedVendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
};

// Delete a vendor
export const deleteVendor = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.vendorProfile.delete({
      where: { id: Number(id) },
    });

    res.status(204).json({ message: 'Vendor deleted' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
};
