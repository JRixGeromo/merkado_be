import { Router } from 'express';
import { createUnitOfMeasure, getAllUnitsOfMeasure } from '../controllers/unitOfMeasureController';

const router = Router();

router.post('/', createUnitOfMeasure); // Create new unit of measure
router.get('/', getAllUnitsOfMeasure); // Get all units of measure

export default router;
