import Joi from "joi";

// ======================================
// SIGNUP VALIDATION
// ======================================

export const signupSchema = Joi.object({

  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter valid email address",
    }),

  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"
      )
    )
    .messages({
      "string.empty": "Password is required",
      "string.min":
        "Password must be at least 6 characters",
      "string.max":
        "Password cannot exceed 20 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase and number",
    }),

});

// ======================================
// LOGIN VALIDATION
// ======================================

export const loginSchema = Joi.object({

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter valid email address",
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
    }),

});

// ======================================
// SEND OTP VALIDATION
// ======================================

export const sendOtpSchema = Joi.object({

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter valid email address",
    }),

});

// ======================================
// VERIFY OTP VALIDATION
// ======================================

export const verifyOtpSchema = Joi.object({

  email: Joi.string()
    .trim()
    .email()
    .required(),

  otp: Joi.string()
    .length(6)
    .required()
    .messages({
      "string.length": "OTP must be 6 digits",
      "string.empty": "OTP is required",
    }),

});