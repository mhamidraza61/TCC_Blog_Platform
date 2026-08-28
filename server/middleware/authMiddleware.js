const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ERROR_MESSAGES = require("../constants/errorMessages");

const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401);
        throw new Error(ERROR_MESSAGES.AUTH.USER_NOT_FOUND_FOR_TOKEN);
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error(ERROR_MESSAGES.AUTH.TOKEN_FAILED));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error(ERROR_MESSAGES.AUTH.NO_TOKEN));
  }
};

module.exports = { protect };
