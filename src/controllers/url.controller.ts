import { RequestHandler } from 'express';
import {shortCodeSchema, shortenUrlSchema} from "../validators/url.validator";
import {sendError, sendSuccess} from "../utils/response";
import {STATUS_CODES} from "../utils/statusCodes";
import {APP_MESSAGES, STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES} from "../utils/statusMessages";
import {createShortUrlService, getShortUrlService, getUserUrlsService} from "../services/url.service";
import {ShortUrlRequestBody} from "../interfaces/url/shorten-url.interface";
import {AppError} from "../utils/appError";


export const shortenUrl: RequestHandler = async (req, res) => {
    const { error, value } = shortenUrlSchema.validate(req.body);

    if (error) {
         sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.message,
            STATUS_MESSAGES.BAD_REQUEST
        );
    }

    const userId = (req as any).user?.userId || null;

    try {
        const newUrl = await createShortUrlService(value as ShortUrlRequestBody, userId);

        sendSuccess(res, STATUS_CODES.CREATED, STATUS_MESSAGES.CREATED, newUrl);
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

export const redirectShortUrl: RequestHandler = async (req, res) => {
    const { error, value } = shortCodeSchema.validate(req.params);

    if (error) {
        sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.message,
            STATUS_MESSAGES.BAD_REQUEST
        );
        return
    }

    try {
        const urlData = await getShortUrlService(value.shortCode);

        if (!urlData) {
             sendError(
                res,
                STATUS_CODES.NOT_FOUND,
                APP_MESSAGES.SHORT_URL_NOT_FOUND,
                STATUS_MESSAGES.NOT_FOUND
            );
             return;
        }

        // Increment visit count (optional async, no await)
        // incrementVisitCount(shortCode); // Can be added for analytics

         res.redirect(urlData.targetUrl);
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

export const getUserUrlsByUserId: RequestHandler = async (req, res) => {
    const userId = (req as any).user?.userId;

    if (!userId) {
         sendError(
            res,
            STATUS_CODES.UNAUTHORIZED,
            STATUS_MESSAGES.UNAUTHORIZED,
            STATUS_MESSAGES.UNAUTHORIZED
        );
         return;
    }

    try {
        const urls = await getUserUrlsService(userId);

         sendSuccess(
            res,
            STATUS_CODES.OK,
            STATUS_MESSAGES.OK,
            urls
        );
    } catch (err: any) {
         sendError(
            res,
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            err.message || 'Failed to fetch URLs',
            STATUS_MESSAGES.INTERNAL_SERVER_ERROR
        );
    }
};
