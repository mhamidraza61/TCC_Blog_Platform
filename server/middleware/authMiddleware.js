const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ERROR_MESSAGES = require("../constants/errorMessages");
const { COOKIE_NAME } = require("../utils/tokenCookie");

// Reads the JWT from the httpOnly cookie (set by tokenCookie.js at
// login/register) instead of an Authorization header — cookie-parser
// middleware (added in server.js) is what makes req.cookies exist here.
const protect = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401);
    return next(new Error(ERROR_MESSAGES.AUTH.NO_TOKEN));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      throw new Error(ERROR_MESSAGES.AUTH.USER_NOT_FOUND_FOR_TOKEN);
    }

    next();
  } catch (error) {
    res.status(401);
    next(new Error(ERROR_MESSAGES.AUTH.TOKEN_FAILED));
  }
};

module.exports = { protect };
