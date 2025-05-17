import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, registerUser);

export default router;
