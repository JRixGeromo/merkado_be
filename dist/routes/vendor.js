"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendorController_1 = require("../controllers/vendorController");
const router = (0, express_1.Router)();
// Create a new vendor
router.post('/', vendorController_1.createVendor);
// Get a single vendor by ID
router.get('/:id', vendorController_1.getVendor);
// Get all vendors
router.get('/', vendorController_1.getAllVendors);
// Update a vendor by ID
router.put('/:id', vendorController_1.updateVendor);
// Delete a vendor by ID
router.delete('/:id', vendorController_1.deleteVendor);
exports.default = router;
