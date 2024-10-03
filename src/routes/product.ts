import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productController';

const router = Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);

export default router;
