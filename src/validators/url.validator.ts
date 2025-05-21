import Joi from 'joi';

    export const shortenUrlSchema = Joi.object({
    targetUrl: Joi.string().uri().required().messages({
        'string.base': `"targetUrl" should be a type of 'text'`,
        'string.uri': `"targetUrl" must be a valid URI`,
        'any.required': `"targetUrl" is a required field`,
    }),
});
