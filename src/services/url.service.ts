import prisma from '../db/db';
import {generateUniqueShortCode} from "../helpers/generateShortCodeHelper";
import {ExpirationType} from "../utils/enums";
import {ShortUrlRequestBody} from "../interfaces/url/shorten-url.interface";
import {AppError} from "../utils/appError";
import {RedisKeys} from "../utils/cacheKeys";
import RedisHelper from "../helpers/redisCacheHelper";

export const createShortUrlService = async (
    data: ShortUrlRequestBody,
    userId: string | null
) => {
    const {
        targetUrl,
        expirationType = ExpirationType.SEVEN_DAYS,
        customExpiryDate,
    } = data;

    let expiresAt: Date | null = null;

    if (expirationType === ExpirationType.CUSTOM) {
        if (!customExpiryDate) {
            throw new AppError('customExpiryDate required when expirationType is CUSTOM', 400);
        }
        expiresAt = new Date(customExpiryDate);
    } else if (expirationType !== ExpirationType.NONE) {
        const days = EXPIRATION_DAYS_MAP[expirationType];
        if (typeof days !== 'number') {
            throw new AppError('Invalid expiration type.', 400);
        }

        const now = new Date();
        expiresAt = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + days + 1,
            23, 0, 0, 0
        );
    }

    const cacheKey = userId
        ? RedisKeys.userShortUrl(userId, targetUrl)
        : RedisKeys.guestShortUrl(targetUrl);

    // Check Redis first
    const cached = await RedisHelper.get(cacheKey);

    if (cached) return cached;

    // Prevent duplicate URL creation for guest (unauthenticated) users with same active short code
    if (userId) {
        const existingUrl = await prisma.url.findFirst({
            where: {
                targetUrl,
                userId: userId,
                deleted: false,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                expirationType,
            },
        });

        if (existingUrl) {
            await RedisHelper.set(cacheKey, {
                shortCode: existingUrl.shortCode,
                targetUrl: existingUrl.targetUrl,
                expiresAt: existingUrl.expiresAt,
            });
            return {
                shortCode: existingUrl.shortCode,
                targetUrl: existingUrl.targetUrl,
                expiresAt: existingUrl.expiresAt,
            };
        }
    } else {
        const existingUrl = await prisma.url.findFirst({
            where: {
                targetUrl,
                userId: null,
                deleted: false,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                expirationType,
            },
        });

        if (existingUrl) {
            await RedisHelper.set(cacheKey, {
                shortCode: existingUrl.shortCode,
                targetUrl: existingUrl.targetUrl,
                expiresAt: existingUrl.expiresAt,
            });
            return {
                shortCode: existingUrl.shortCode,
                targetUrl: existingUrl.targetUrl,
                expiresAt: existingUrl.expiresAt,
            };
        }
    }

    const shortCode = await generateUniqueShortCode();

    const newUrl = await prisma.url.create({
        data: {
            shortCode,
            targetUrl,
            userId,
            expiresAt,
            expirationType,
        },
    });

    await RedisHelper.set(cacheKey, {
        shortCode: newUrl.shortCode,
        targetUrl: newUrl.targetUrl,
        expiresAt: newUrl.expiresAt,
    });

    return {
        shortCode: newUrl.shortCode,
        targetUrl: newUrl.targetUrl,
        expiresAt: newUrl.expiresAt,
    };
};

const EXPIRATION_DAYS_MAP: Record<ExpirationType, number | null> = {
    ONE_DAY : 1,
    TWO_DAYS: 2,
    THREE_DAYS: 3,
    FOUR_DAYS: 4,
    FIVE_DAYS: 5,
    SIX_DAYS: 6,
    SEVEN_DAYS: 7,
    CUSTOM: null,
    NONE: null,
};
