'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const orderController_1 = require('../controllers/orderController');
const router = (0, express_1.Router)();
router.post('/', orderController_1.createOrder); // To create a new order
router.get('/:id', orderController_1.getOrderById); // To get an order by ID
router.put('/:id', orderController_1.updateOrderStatus); // To update order status
exports.default = router;
