const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidators");
const ERROR_MESSAGES = require("../constants/errorMessages");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: ERROR_MESSAGES.GENERIC.RATE_LIMITED },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);

module.exports = router;
