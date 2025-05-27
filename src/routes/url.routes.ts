import express from 'express';
import {redirectShortUrl, shortenUrl} from '../controllers/url.controller';
import {authLimiter} from "../middleware/rateLimit";
import {authenticate} from "../middleware/auth.middleware";

const router = express.Router();

router.post('/shorten', authenticate, authLimiter, shortenUrl);
router.get('/:shortCode', authLimiter, redirectShortUrl);

export default router;
