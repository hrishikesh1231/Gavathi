import Joi from "joi";

// ========================================
// CREATE ORDER VALIDATION
// ========================================

export const createOrderSchema = Joi.object({

  customer: Joi.object({

    name: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Full name is required",
      }),

    address: Joi.string()
      .trim()
      .min(10)
      .required()
      .messages({
        "string.empty": "Address is required",
      }),

    taluka: Joi.string()
      .trim()
      .required()
      .messages({
        "string.empty": "Taluka is required",
      }),

    district: Joi.string()
      .trim()
      .required()
      .messages({
        "string.empty": "District is required",
      }),

    pinCode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Pin code must be 6 digits",
      }),

    whatsappNumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .allow("")
      .optional()
      .messages({
        "string.pattern.base":
          "WhatsApp number must be 10 digits",
      }),

    callingNumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Calling number must be 10 digits",
      }),

  }).required(),

  products: Joi.array()
    .min(1)
    .required()
    .messages({
      "array.min":
        "At least one product is required",
    }),

  totalPrice: Joi.number()
    .min(1)
    .required()
    .messages({
      "number.min":
        "Total price must be greater than 0",
    }),

  seller: Joi.string()
    .required()
    .messages({
      "string.empty":
        "Seller information missing",
    }),

});