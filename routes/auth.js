import { User } from "../models/User.js";
import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    // Check if the user already exists
    const existing = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create a new user
    const user = new User.User({
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      role: req.body.role,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Insert multiple users
router.post("/register-multiple", async (req, res) => {
  try {
    const users = req.body.users;
    const profilesData = req.body.profilesData;
    const hashedUsers = await Promise.all(
      users.map(async (user, index) => {
        const existing = await User.findOne({
          email: user.email.toLowerCase(),
        });
        if (existing) {
          throw new Error(`User with email ${user.email} already exists`);
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          email: user.email.toLowerCase(),
          password: hashedPassword,
          role: user.role,
          profileData: profilesData[index], // Assuming profilesData is an array with the same order as users
        };
      })
    );
    await User.insertMany(hashedUsers);
    res.status(201).json({ message: "Users created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
