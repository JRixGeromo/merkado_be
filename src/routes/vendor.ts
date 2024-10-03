import { Router } from 'express';
import { createVendor, getVendor, getAllVendors, updateVendor, deleteVendor } from '../controllers/vendorController';

const router = Router();

// Create a new vendor
router.post('/', createVendor);

// Get a single vendor by ID
router.get('/:id', getVendor);

// Get all vendors
router.get('/', getAllVendors);

// Update a vendor by ID
router.put('/:id', updateVendor);

// Delete a vendor by ID
router.delete('/:id', deleteVendor);

export default router;
