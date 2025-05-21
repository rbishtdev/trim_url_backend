import prisma from '../db/db';
import {generateShortCode} from "../helpers/shortCodeHelper";

export const createShortUrlService = async (targetUrl: string, userId: string | null) => {
    const shortCode = await generateUniqueShortCode();

    const newUrl = await prisma.url.create({
        data: {
            shortCode,
            targetUrl,
            userId: userId || undefined,
        },
    });

    return {
        shortCode: newUrl.shortCode,
        targetUrl: newUrl.targetUrl,
    };
};

const generateUniqueShortCode = async (): Promise<string> => {
    let code: string;
    let exists = true;

    do {
        code = generateShortCode();
        const found = await prisma.url.findUnique({ where: { shortCode: code } });
        exists = !!found;
    } while (exists);

    return code;
};
