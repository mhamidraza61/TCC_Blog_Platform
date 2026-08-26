const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Runs before any route that needs a logged-in user. Checks for a
// "Bearer <token>" Authorization header, verifies it, and if valid,
// attaches the matching user to req.user so later code (e.g. authorization
// checks) can use it.
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded.id came from generateToken.js when the token was created
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401);
        throw new Error("User belonging to this token no longer exists");
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token provided"));
  }
};

module.exports = { protect };
