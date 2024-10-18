import joi from 'joi';

export const validateRegisterUser = async (data) => {
    try {
        const schema = joi.object({
            firstname: joi.string().trim().required()
                .messages({
                    'string.base': 'First name should be a type of string',
                    'string.empty': 'First name cannot be empty',
                    'any.required': 'First name is required'
                }),
            lastname: joi.string().trim().required()
                .messages({
                    'string.base': 'Last name should be a type of string',
                    'string.empty': 'Last name cannot be empty',
                    'any.required': 'Last name is required'
                }),
            phone: joi.string().min(10).max(12).required()
                .messages({
                    'string.pattern.base': 'Phone number must be 10 digit',
                    'string.empty': 'Phone number cannot be empty',
                    'any.required': 'Phone number is required'
                }),
            email: joi.string().email().required()
                .messages({
                    'string.email': 'Email must be a valid email address',
                    'string.empty': 'Email cannot be empty',
                    'any.required': 'Email is required'
                }),
            code: joi.string().empty().optional(),
            password: joi.string().min(6).required()
                .messages({
                    'string.min': 'Password must be at least 6 characters long',
                    'string.empty': 'Password cannot be empty',
                    'any.required': 'Password is required'
                }),
            dob: joi.date().less('2020-01-01').iso().required()
                .messages({
                    'date.less': 'Date of birth must be before January 1, 2020',
                    'date.isoDate': 'Date of birth must be in ISO format (YYYY-MM-DD)',
                    'date.base': 'Date of birth must be a valid date',
                    'any.required': 'Date of birth is required'
                })
        });

        // Validate data against schema
        await schema.validateAsync(data, { abortEarly: false });

        // If validation passes
        return { success: true };

    } catch (error) {
        // If validation fails
        return { success: false, error: error.details };
    }
};
