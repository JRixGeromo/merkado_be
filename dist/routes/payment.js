'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const paymentController_1 = require('../controllers/paymentController');
const router = (0, express_1.Router)();
router.post('/', paymentController_1.createPayment); // Create a new payment
router.get('/:orderId', paymentController_1.getPaymentByOrderId); // Get payment by order ID
exports.default = router;
