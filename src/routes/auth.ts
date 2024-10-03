import { Router } from 'express';
import { registerUser, loginUser, googleAuth, facebookAuth } from '../controllers/authController';

const router = Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

router.get('/google', googleAuth);
router.get('/facebook', facebookAuth);

export default router;
