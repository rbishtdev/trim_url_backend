import {JwtPayload} from "../interfaces/auth/jwt-payload.interface"; // or wherever your JWT payload interface is

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export {};

