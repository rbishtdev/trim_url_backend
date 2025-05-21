import { RequestHandler } from 'express';
import {shortenUrlSchema} from "../validators/url.validator";
import {sendError, sendSuccess} from "../utils/response";
import {STATUS_CODES} from "../utils/statusCodes";
import {STATUS_MESSAGES} from "../utils/statusMessages";
import {createShortUrlService} from "../services/url.service";


export const shortenUrl: RequestHandler = async (req, res) => {
    const { error, value } = shortenUrlSchema.validate(req.body);

    if (error) {
        sendError(res, STATUS_CODES.BAD_REQUEST, error.message, STATUS_MESSAGES.BAD_REQUEST);
        return;
    }

    const { targetUrl } = value;
    const userId = (req as any).user?.userId || null;

    try {
        const newUrl = await createShortUrlService(targetUrl, userId);

        sendSuccess(res, STATUS_CODES.CREATED, STATUS_MESSAGES.CREATED, newUrl);
    } catch (err: any) {
        const status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGES.INTERNAL_SERVER_ERROR;
        sendError(res, status, message, errorText);
    }
};
