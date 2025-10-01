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

export const addFacultySchema = Joi.object({
  universityId: Joi.string().required().messages({
    "string.base": "University ID must be a string",
    "any.required": "University ID is required",
  }),
  facultyName: Joi.string().min(2).required().messages({
    "string.base": "Faculty name must be a string",
    "string.min": "Faculty name must be at least 2 characters",
    "any.required": "Faculty name is required",
  }),
});

export const addDepartmentSchema = Joi.object({
  facultyId: Joi.string().required().messages({
    "string.base": "Faculty ID must be a string",
    "any.required": "Faculty ID is required",
  }),
  departmentName: Joi.string().min(2).required().messages({
    "string.base": "Department name must be a string",
    "string.min": "Department name must be at least 2 characters",
    "any.required": "Department name is required",
  }),
});