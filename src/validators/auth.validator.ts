import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'string.base': `"refreshToken" should be a type of 'text'`,
        'any.required': `"refreshToken" is a required field`,
    }),
});
