import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // Check if the user already exists
    const existing = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    
    if (existing) {
      res.status(400);
      throw new Error("User already exists");
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create a new user
    const user = new User({
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      role: req.body.role,
    });
    
    const savedUser = await user.save();
    
    if (savedUser) {
      res.status(201).json({
        _id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        token: generateToken(savedUser._id),
      });
    }
  } catch (err) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(err.message);
  }
};

// @desc    Authenticate user & get token
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(err.message);
  }
};

// @desc    Get user profile
// @route   GET /auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(err.message);
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { registerUser, loginUser, getUserProfile };