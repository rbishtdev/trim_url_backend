import express from 'express';
import {getUrlStats, getUserUrlsByUserId, redirectShortUrl, shortenUrl} from '../controllers/url.controller';
import {authLimiter} from "../middleware/rateLimit";
import {authenticate} from "../middleware/auth.middleware";

const router = express.Router();

router.post('/shorten', authenticate, authLimiter, shortenUrl);
router.get('/shortCode/:shortCode', authLimiter, redirectShortUrl);
router.get('/userShortenUrls', authenticate, authLimiter, getUserUrlsByUserId);
router.get('/:shortCode/stats', authenticate, authLimiter, getUrlStats);

export default router;
