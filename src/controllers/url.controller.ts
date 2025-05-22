import { RequestHandler } from 'express';
import {shortenUrlSchema} from "../validators/url.validator";
import {sendError, sendSuccess} from "../utils/response";
import {STATUS_CODES} from "../utils/statusCodes";
import {STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES} from "../utils/statusMessages";
import {createShortUrlService} from "../services/url.service";
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