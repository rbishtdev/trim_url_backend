import { Router } from 'express';
import {loginUser, registerUser} from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

export default router;
