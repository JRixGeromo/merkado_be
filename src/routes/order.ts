import { Router } from 'express';
import { createOrder, getOrderById, updateOrderStatus } from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id', updateOrderStatus);

export default router;
