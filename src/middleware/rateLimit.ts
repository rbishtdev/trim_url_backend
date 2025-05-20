import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,                   // limit each IP to 5 requests per windowMs
    message: 'Too many attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});