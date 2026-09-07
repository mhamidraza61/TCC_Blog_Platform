import { z } from "zod";
import ERROR_MESSAGES from "../constants/errorMessages";

// These mirror server/validators/authValidators.js exactly — same rules,
// same messages (both pulled from a frozen constants object on their
// own side), so the frontend and backend never disagree about what
// counts as a valid email or password.
export const registerSchema = z.object({
  name: z.string().trim().min(2, ERROR_MESSAGES.VALIDATION.NAME_MIN_LENGTH),
  email: z.string().trim().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: z.string().min(6, ERROR_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
});

export const loginSchema = z.object({
  email: z.string().trim().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: z.string().min(1, ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED),
});
