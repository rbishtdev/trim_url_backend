import prisma from '../db/db';
import {generateUniqueShortCode} from "../helpers/generateShortCodeHelper";

export const createShortUrlService = async (targetUrl: string, userId: string | null) => {
    let existingUrl;
    console.log(userId);
    if (userId) {
        existingUrl = await prisma.url.findFirst({
            where: {
                targetUrl,
                userId,
                deleted: false,
            },
        });
        console.log(existingUrl);
    } else {
        existingUrl = await prisma.url.findFirst({
            where: {
                targetUrl,
                userId: {
                    equals: null,
                },
                deleted: false,
            },
        });
        console.log(existingUrl);

    }

    if (existingUrl) {
        return {
            shortCode: existingUrl.shortCode,
            targetUrl: existingUrl.targetUrl,
        };
    }

    const shortCode = await generateUniqueShortCode();

    const newUrl = await prisma.url.create({
        data: {
            shortCode,
            targetUrl,
            userId: userId ?? null,
        },
    });

    return {
        shortCode: newUrl.shortCode,
        targetUrl: newUrl.targetUrl,
    };
};
