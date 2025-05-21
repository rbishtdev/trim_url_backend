import {STATUS_CODES} from "./statusCodes";

export const STATUS_MESSAGES = {
    OK: 'Success',
    CREATED: 'Resource created successfully',
    NO_CONTENT: 'No content',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not found',
    CONFLICT: 'Conflict occurred',
    UNPROCESSABLE_ENTITY: 'Unprocessable entity',
    INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;

export const APP_MESSAGES = {
    USER_ALREADY_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User does not exist',
    INVALID_EMAIL_PASSWORD: 'Invalid email and password',
    REFRESH_TOKEN_INVALID: 'Refresh token is invalid or blacklisted',
    VALIDATION_FAILED: 'Validation failed',
    INVALID_EXPIRE_TOKEN: 'Invalid or expired token',
} as const;

export const STATUS_MESSAGE_BY_CODE: Record<number, string> = {
    [STATUS_CODES.OK]: STATUS_MESSAGES.OK,
    [STATUS_CODES.CREATED]: STATUS_MESSAGES.CREATED,
    [STATUS_CODES.NO_CONTENT]: STATUS_MESSAGES.NO_CONTENT,
    [STATUS_CODES.BAD_REQUEST]: STATUS_MESSAGES.BAD_REQUEST,
    [STATUS_CODES.UNAUTHORIZED]: STATUS_MESSAGES.UNAUTHORIZED,
    [STATUS_CODES.FORBIDDEN]: STATUS_MESSAGES.FORBIDDEN,
    [STATUS_CODES.NOT_FOUND]: STATUS_MESSAGES.NOT_FOUND,
    [STATUS_CODES.CONFLICT]: STATUS_MESSAGES.CONFLICT,
    [STATUS_CODES.UNPROCESSABLE_ENTITY]: STATUS_MESSAGES.UNPROCESSABLE_ENTITY,
    [STATUS_CODES.INTERNAL_SERVER_ERROR]: STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
};