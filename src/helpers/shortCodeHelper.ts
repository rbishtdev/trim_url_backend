import prisma from '../db/db';

export const SHORT_CODE_LENGTH = 8;

export const generateShortCode = (length = SHORT_CODE_LENGTH): string => {
    return Math.random().toString(36).substring(2, 2 + length);
};

export const generateUniqueShortCode = async (length = SHORT_CODE_LENGTH): Promise<string> => {
    let code: string;
    let exists = true;

    do {
        code = generateShortCode(length);
        const existing = await prisma.url.findUnique({ where: { shortCode: code } });
        exists = !!existing;
    } while (exists);

    return code;
};
