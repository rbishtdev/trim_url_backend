import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from "path";

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
    ),
});

export const redisCacheHelper = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined,
}).on('connect', () => {
    console.log('✅ Redis connected');
}).on('error', (err) => {
    console.error('❌ Redis error:', err);
});


