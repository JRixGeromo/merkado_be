import { Router } from 'express';
import { createAddress, getAddressesForUser } from '../controllers/addressController';

const router = Router();

router.post('/', createAddress); // Create new address
router.get('/user/:userId', getAddressesForUser); // Get all addresses for a user

export default router;
