import { customAlphabet } from 'nanoid';
import  prisma from '../db/db';

const CHAR_SET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const SHORT_CODE_LENGTH = 6;
const MAX_ATTEMPTS = 5;

const nanoid = customAlphabet(CHAR_SET, SHORT_CODE_LENGTH);

export const generateUniqueShortCode = async (): Promise<string> => {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const code = nanoid();
        const existing = await prisma.url.findUnique({
            where: { shortCode: code },
        });

        if (!existing) return code;
    }

    throw new Error('Failed to generate unique short code after max attempts.');
};