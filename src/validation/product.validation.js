import Joi from "joi";

export const productValidationSchema = Joi.object({
    name: Joi.string().max(100).required().messages({
        'string.empty': 'Product name is required',
        'string.max': 'Product name must be less than 100 characters'
    }),
    type: Joi.string(),
    price: Joi.number().min(0).required().messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price must be a positive number',
        'any.required': 'Price is required'
    }),
    description: Joi.string().max(1000).optional(),
    category: Joi.string(),
    stock: Joi.number().min(0).required().messages({
        'number.min': 'Stock quantity must be a positive number',
        'any.required': 'Stock quantity is required'
    }),
    brand: Joi.string().max(50).optional(),
    sku: Joi.string().required().messages({
        'string.empty': 'SKU is required'
    }),

    tags: Joi.string().optional(),
    quantity: Joi.number().min(0).optional(),
    unit: Joi.string().valid('kg', 'liter', 'gram', 'ml', 'unit').optional(),
    variants: Joi.array().items(
        Joi.object({
            color: Joi.string().optional(),
            size: Joi.string().optional(),
            additionalPrice: Joi.number().default(0)
        })
    ).optional(),
    // warranty: Joi.string().optional(),
    isFeatured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
});