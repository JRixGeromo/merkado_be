import { Router } from 'express';
import { 
  createProductCategory, 
  getProductCategory, 
  getAllProductCategories, 
  updateProductCategory, 
  deleteProductCategory 
} from '../controllers/productCategoryController';

const router = Router();

// Create a new product category
router.post('/', createProductCategory);

// Get a single product category by ID
router.get('/:id', getProductCategory);

// Get all product categories
router.get('/', getAllProductCategories);

// Update a product category by ID
router.put('/:id', updateProductCategory);

// Delete a product category by ID
router.delete('/:id', deleteProductCategory);

export default router;
