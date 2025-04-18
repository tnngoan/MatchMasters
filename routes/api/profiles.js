import express from "express";
import { getProfiles, getProfileById, createProfile, updateProfile } from "../../controllers/profileController.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get('/', getProfiles);
router.get('/:id', getProfileById);

// Protected routes
router.post('/', protect, createProfile);
router.put('/:id', protect, updateProfile);

export default router;