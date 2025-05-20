import { Router } from 'express';
import {loginUser, refreshAccessToken, registerUser} from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/refreshToken', refreshAccessToken);

export default router;
