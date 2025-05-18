import {loginSchema, registerSchema} from '../validators/auth.validator';
import {loginUserService, registerUserService} from '../services/auth.service';
import { RequestHandler } from 'express';
import {sendError, sendSuccess} from '../utils/response';
import {STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES} from "../utils/statusMessages";
import {STATUS_CODES} from "../utils/statusCodes";
import {AppError} from "../utils/appError";

interface RegisterRequestBody {
    name?: string;
    email: string;
    password: string;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export const registerUser: RequestHandler<{}, any, RegisterRequestBody> = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        sendError(res, STATUS_CODES.BAD_REQUEST, 'Validation failed', STATUS_MESSAGES.BAD_REQUEST);
        return;
    }

    const { email, password, name } = value;

    try {
        const { user, accessToken, refreshToken } = await registerUserService(email, password, name);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(
            res,
            STATUS_CODES.CREATED,
            STATUS_MESSAGES.CREATED,
            { user, accessToken }
        );
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

export const loginUser: RequestHandler<{}, any, LoginRequestBody> = async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        sendError(res, STATUS_CODES.BAD_REQUEST, 'Validation failed', STATUS_MESSAGES.BAD_REQUEST);
        return;
    }

    const { email, password } = value;

    try {
        const { user, accessToken, refreshToken } = await loginUserService(email, password);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(
            res,
            STATUS_CODES.OK,
            STATUS_MESSAGES.OK,
            { user, accessToken, refreshToken }
        );
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};