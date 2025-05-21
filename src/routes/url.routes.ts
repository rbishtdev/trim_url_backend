import express from 'express';
import { shortenUrl } from '../controllers/url.controller';
import {authLimiter} from "../middleware/rateLimit";

const router = express.Router();

router.post('/shorten', authLimiter, shortenUrl);

export default router;
