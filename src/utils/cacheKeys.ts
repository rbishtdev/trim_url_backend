export const RedisKeys = {
    guestShortUrl: (targetUrl: string) =>
        `cache:shortUrl:guest:${targetUrl}`,

    userShortUrl: (userId: string, targetUrl: string) =>
        `cache:shortUrl:user:${userId}:${targetUrl}`,

    shortCodeData: (shortCode: string) =>
        `cache:shortUrl:code:${shortCode}`,
};
