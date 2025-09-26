// validators/auth.schema.ts
import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const verifyOtpSchema = Joi.object({
  otp: Joi.string().required().min(6).max(6)
});

export const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().required(),
  newPassword: Joi.string().required().min(6)
});
