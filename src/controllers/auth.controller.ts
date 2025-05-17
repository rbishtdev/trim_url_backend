import { registerSchema } from '../validators/auth.validator';
import { registerUserService } from '../services/auth.service';
import { RequestHandler } from 'express';

interface RegisterRequestBody {
    name?: string;
    email: string;
    password: string;
}

export const registerUser: RequestHandler<{}, any, RegisterRequestBody> = async (req, res) => {
    console.log('📥 Register endpoint hit');
    console.log(req.body);

    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
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

        res.status(201).json({ user, accessToken }); // ✅ Just call it, don't return
    } catch (err: any) {
        res.status(409).json({ message: err.message });
    }
};
