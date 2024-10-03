import { Router } from 'express';
import { registerUser, loginUser, googleAuth, facebookAuth } from '../controllers/authController';

const router = Router();

router.post('/register', registerUser);
//router.post('/login', loginUser);
router.get('/google', googleAuth);
router.get('/facebook', facebookAuth);

export default router;
