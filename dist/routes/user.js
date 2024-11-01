'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const userController_1 = require('../controllers/userController');
const router = (0, express_1.Router)();
router.get('/', userController_1.getAllUsers); // Get all users
router.get('/:id', userController_1.getUserById); // Get user by ID
router.put('/:id', userController_1.updateUser); // Update user
exports.default = router;
