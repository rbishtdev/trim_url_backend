import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
