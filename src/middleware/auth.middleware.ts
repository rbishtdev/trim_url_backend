import jwt from 'jsonwebtoken';
import {JwtPayload} from '../interfaces/auth/jwt-payload.interface';
import {sendError} from '../utils/response';
import {STATUS_CODES} from "../utils/statusCodes";
import {APP_MESSAGES, STATUS_MESSAGES} from "../utils/statusMessages";
import {verifyToken} from "../utils/jwt";

export const authenticate: (req: any, res: any, next: any) => (void) = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.split(' ')[1];

    try {
        req.user = verifyToken(token, process.env.JWT_SECRET!);
        next();
    } catch (err) {
        return sendError(
            res,
            STATUS_CODES.UNAUTHORIZED,
            APP_MESSAGES.INVALID_EXPIRE_TOKEN,
            STATUS_MESSAGES.UNAUTHORIZED
        );
    }
};