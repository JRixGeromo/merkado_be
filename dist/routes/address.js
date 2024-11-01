"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = require("../controllers/addressController");
const router = (0, express_1.Router)();
router.post('/', addressController_1.createAddress); // Create new address
router.get('/user/:userId', addressController_1.getAddressesForUser); // Get all addresses for a user
exports.default = router;
