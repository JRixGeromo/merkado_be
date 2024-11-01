"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unitOfMeasureController_1 = require("../controllers/unitOfMeasureController");
const router = (0, express_1.Router)();
router.post('/', unitOfMeasureController_1.createUnitOfMeasure); // Create new unit of measure
router.get('/', unitOfMeasureController_1.getAllUnitsOfMeasure); // Get all units of measure
exports.default = router;
