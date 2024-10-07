import { Router } from 'express';
import { createOrder, getOrderById, updateOrderStatus } from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);  // To create a new order
router.get('/:id', getOrderById);  // To get an order by ID
router.put('/:id', updateOrderStatus);  // To update order status

export default router;
