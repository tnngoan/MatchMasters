import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Protects routes from unauthorized access
 * Verifies JWT token and attaches user data to request
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

/**
 * Restricts access to admin user only (ngoan.n.tr@gmail.com)
 * Must be used after the protect middleware
 */
const adminOnly = async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, no user found');
  }

  if (req.user.email !== 'ngoan.n.tr@gmail.com') {
    res.status(403);
    throw new Error('Not authorized. This resource is restricted to admin access only.');
  }

  next();
};

export { protect, adminOnly };