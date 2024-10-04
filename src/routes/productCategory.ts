import { Router } from 'express';
import {
  createProductCategory,
  getProductCategory,
  getAllProductCategories,
  updateProductCategory,
  deleteProductCategory,
} from '../controllers/productCategoryController';

const router = Router();

router.post('/', createProductCategory);
router.get('/:id', getProductCategory);
router.get('/', getAllProductCategories);
router.put('/:id', updateProductCategory);
router.delete('/:id', deleteProductCategory);

export default router;
