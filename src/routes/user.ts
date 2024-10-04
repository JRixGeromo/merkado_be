import { Router } from 'express';
import { getAllUsers, getUserById, updateUser } from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers); // Get all users
router.get('/:id', getUserById); // Get user by ID
router.put('/:id', updateUser); // Update user

export default router;
