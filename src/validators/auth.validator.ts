import Joi from 'joi';
import {DeviceType} from "../utils/enums";


export const registerSchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.base': `"name" should be a type of 'text'`,
    }),
    email: Joi.string().email().required().messages({
        'string.base': `"email" should be a type of 'text'`,
        'string.email': `"email" must be a valid email`,
        'any.required': `"email" is a required field`,
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': `"password" should be a type of 'text'`,
        'string.min': `"password" should have a minimum length of {#limit}`,
        'any.required': `"password" is a required field`,
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': `"email" should be a type of 'text'`,
        'string.email': `"email" must be a valid email`,
        'any.required': `"email" is a required field`,
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': `"password" should be a type of 'text'`,
        'string.min': `"password" should have a minimum length of {#limit}`,
        'any.required': `"password" is a required field`,
    }),
    deviceType: Joi.string().valid('WEB', 'MOBILE').required().messages({
        'any.only': `"deviceType" must be either 'WEB' or 'MOBILE'`,
        'string.base': `"deviceType" should be a type of 'text'`,
        'any.required': `"deviceType" is a required field`,
    }),
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
