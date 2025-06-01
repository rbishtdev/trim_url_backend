import { RequestHandler } from 'express';
import {paginationSchema, shortCodeSchema, shortenUrlSchema} from "../validators/url.validator";
import {sendError, sendSuccess} from "../utils/response";
import {STATUS_CODES} from "../utils/statusCodes";
import {APP_MESSAGES, STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES} from "../utils/statusMessages";
import { UAParser } from 'ua-parser-js';
import geoIp from 'geoip-lite';
import {
    createShortUrlService,
    getShortUrlService,
    getUrlStatsService,
    getUserUrlsService, logUrlVisit
} from "../services/url.service";
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

        const parser = new UAParser();
        parser.setUA(req.headers['user-agent'] || '');
        const ua = parser.getResult();

        const xForwardedFor = req.headers['x-forwarded-for'];
        const ipString = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
        const ip = ipString?.split(',')[0].trim() || req.socket?.remoteAddress || '';

        const geo = geoIp.lookup(ip || '');

        // ✅ Log the visit
        await logUrlVisit(
            value.shortCode,
            ip,
            geo?.country || 'Unknown',
            ua.browser.name || 'Unknown',
            ua.os.name || 'Unknown'
        );

         res.redirect(urlData.targetUrl);
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

export const getUserUrlsByUserId: RequestHandler = async (req, res) => {
    const { error, value } = paginationSchema.validate(req.query);

    if (error) {
        sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.message,
            STATUS_MESSAGES.BAD_REQUEST
        );
        return
    }

    const userId = (req as any).user?.userId;

    const page = parseInt(value.page);
    const limit = parseInt(value.limit);

    try {
        const data = await getUserUrlsService(userId, page, limit);

        sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, data);
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

export const getUrlStats: RequestHandler = async (req, res) => {
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
    const userId = (req as any).user?.userId || null;

    try {
        const stats = await getUrlStatsService(value.shortCode, userId);
        sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, stats);
    } catch (error: any) {
        sendError(
            res,
            error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
            error.message || 'Something went wrong',
            'URL Stats Error'
        );
    }
};