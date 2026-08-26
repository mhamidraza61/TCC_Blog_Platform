const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidators");

// Limits repeated login/register attempts from the same IP — a basic
// defense against brute-force password guessing. 20 requests per
// 15 minutes is generous for a real user, but stops rapid automated tries.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);

module.exports = router;
