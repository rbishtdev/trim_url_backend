import express from 'express';
import { shortenUrl } from '../controllers/url.controller';
import {authLimiter} from "../middleware/rateLimit";
import {authenticate} from "../middleware/auth.middleware";

const router = express.Router();

router.post('/shorten', authenticate, authLimiter, shortenUrl);

export default router;
