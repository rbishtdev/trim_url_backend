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


class RedisHelper {
   static async get(key: string): Promise<any | null> {
        const data = await redisCacheHelper.get(key);
        return data ? JSON.parse(data) : null;
    }

    static async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
        await redisCacheHelper.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }

    static async delete(key: string): Promise<void> {
        await redisCacheHelper.del(key);
    }
}
export default RedisHelper;

