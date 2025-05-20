import Joi from 'joi';
import {DeviceType} from "../utils/enums";

export const registerSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    deviceType: Joi.string().min(3).required(),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'string.base': `"refreshToken" should be a type of 'text'`,
        'any.required': `"refreshToken" is a required field`,
    }),
    deviceType: Joi.string()
        .valid(DeviceType.WEB, DeviceType.MOBILE)
        .required()
        .messages({
            'any.only': `"deviceType" must be either 'WEB' or 'MOBILE'`,
            'string.base': `"deviceType" should be a type of 'text'`,
            'any.required': `"deviceType" is a required field`,
        }),
});
