import Joi from 'joi';

    export const shortenUrlSchema = Joi.object({
        targetUrl: Joi.string().uri().required().messages({
            'string.base': `"targetUrl" should be a type of 'text'`,
            'string.uri': `"targetUrl" must be a valid URL`,
            'any.required': `"targetUrl" is required`,
        }),
        expirationType: Joi.string()
            .valid(
                'ONE_DAY', 'TWO_DAYS', 'THREE_DAYS', 'FOUR_DAYS', 'FIVE_DAYS', 'SIX_DAYS', 'SEVEN_DAYS', 'CUSTOM', 'NONE'
            )
            .optional()
            .default('SEVEN_DAYS')
            .messages({
                'any.only': `"expirationType" must be one of [ONE_DAY, TWO_DAYS, THREE_DAYS, FOUR_DAYS, FIVE_DAYS, SIX_DAYS, SEVEN_DAYS, CUSTOM, NONE]`,
            }),
        customExpiryDate: Joi.when('expirationType', {
            is: 'CUSTOM',
            then: Joi.date().iso().required().messages({
                'date.base': `"customExpiryDate" should be a valid ISO date`,
                'any.required': `"customExpiryDate" is required when expirationType is CUSTOM`,
            }),
            otherwise: Joi.forbidden(),
        }),
    });

export const shortCodeSchema = Joi.object({
    shortCode: Joi.string().length(6).required().messages({
        'string.base': `"shortCode" should be a type of 'text'`,
        'string.min': `"shortCode" should have a minimum length of {#limit}`,
        'any.required': `"shortCode" is a required field`,
    }),
});

export const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
});