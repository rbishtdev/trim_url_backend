import {loginSchema, refreshTokenSchema, registerSchema} from '../validators/auth.validator';
import {handleRefreshTokenService, loginUserService, registerUserService} from '../services/auth.service';
import {RequestHandler} from 'express';
import {sendError, sendSuccess} from '../utils/response';
import {APP_MESSAGES, STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES} from "../utils/statusMessages";
import {STATUS_CODES} from "../utils/statusCodes";
import {AppError} from "../utils/appError";
import {DeviceType} from "../utils/enums";
import {RegisterRequestBody} from "../interfaces/auth/register.interface";
import {LoginRequestBody} from "../interfaces/auth/login.interface";
import {RefreshTokenRequestBody} from "../interfaces/auth/refresh-token.interface";

export const registerUser: RequestHandler<{}, any, RegisterRequestBody> = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        sendError(res, STATUS_CODES.BAD_REQUEST, error.message, STATUS_MESSAGES.BAD_REQUEST);
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
        sendError(res, STATUS_CODES.BAD_REQUEST, error.message, STATUS_MESSAGES.BAD_REQUEST);
        return;
    }

    const { email, password, deviceType } = value;

    try {
        const { user, accessToken, refreshToken } = await loginUserService(email, password, deviceType);

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

export const refreshAccessToken: RequestHandler<{}, any, RefreshTokenRequestBody> = async (req, res) => {
    const {error, value} = refreshTokenSchema.validate(req.body);

    if (error) {
        sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.message,
            STATUS_MESSAGES.BAD_REQUEST
        );
        return;
    }
    const {refreshToken, deviceType} = value;

    try {
        const {newAccessToken, newRefreshToken} = await handleRefreshTokenService(refreshToken, deviceType);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(
            res,
            STATUS_CODES.OK,
            STATUS_MESSAGES.OK,
            { accessToken: newAccessToken, refreshToken: newRefreshToken }
        );
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};