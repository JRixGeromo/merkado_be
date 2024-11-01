"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Register a new user
router.post('/register', authController_1.registerUser);
// Login a user
router.post('/login', authController_1.loginUser);
router.get('/google', authController_1.googleAuth);
router.get('/facebook', authController_1.facebookAuth);
exports.default = router;
