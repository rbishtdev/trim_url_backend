import prisma from '../db/db';

export const softDeleteExpiredLinks = async () => {
    try {
        const now = new Date();

        const result = await prisma.url.updateMany({
            where: {
                expiresAt: {
                    lte: now,
                },
                deleted: false,
            },
            data: {
                deleted: true,
                deletedAt: new Date(), // ✅ Proper Date object
            },
        });

        console.log(`[Soft Delete] ${result.count} expired links marked as deleted at ${now.toISOString()}`);
    } catch (error) {
        console.error('[Soft Delete] Error while soft-deleting expired URLs:', error);
    }
};
