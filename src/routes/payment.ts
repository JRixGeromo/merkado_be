import { Router } from 'express';
import { createPayment, getPaymentByOrderId } from '../controllers/paymentController';

const router = Router();

router.post('/', createPayment); // Create a new payment
router.get('/:orderId', getPaymentByOrderId); // Get payment by order ID

export default router;
