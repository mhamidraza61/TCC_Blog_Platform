const User = require("../models/User");
const { sendTokenCookie, clearTokenCookie } = require("../utils/tokenCookie");
const ERROR_MESSAGES = require("../constants/errorMessages");

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.AUTH.EMAIL_EXISTS);
    }

    const user = await User.create({ name, email, password });

    sendTokenCookie(res, user._id);

    // No token in the JSON body anymore — it only ever exists inside the
    // httpOnly cookie the line above just set. The response only carries
    // non-sensitive profile info the frontend needs to render a UI.
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    sendTokenCookie(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out — clears the auth cookie server-side
// @route   POST /api/auth/logout
const logoutUser = (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ message: "Logged out" });
};

// @desc    Get the currently logged-in user's profile
// @route   GET /api/auth/me
// Requires the "protect" middleware to have already run — this is how
// the frontend finds out "am I logged in?" on page load, since it can
// no longer just check localStorage for a token it can't read anyway.
const getMe = (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

module.exports = { registerUser, loginUser, logoutUser, getMe };
