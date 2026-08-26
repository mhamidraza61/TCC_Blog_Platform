const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("A user with this email already exists");
    }

    // password gets hashed automatically by the pre("save") hook in User.js
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
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

    // .select("+password") is needed because the User model sets
    // password: { select: false } by default
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
