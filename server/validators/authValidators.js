const { z } = require("zod");
const ERROR_MESSAGES = require("../constants/errorMessages");

const registerSchema = z.object({
  name: z.string().trim().min(2, ERROR_MESSAGES.VALIDATION.NAME_MIN_LENGTH),
  email: z.string().trim().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: z.string().min(6, ERROR_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
});

const loginSchema = z.object({
  email: z.string().trim().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: z.string().min(1, ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED),
});

module.exports = { registerSchema, loginSchema };
