import express from "express";
import { getHomeData } from "../../controllers/homeController.js";
import { protect, adminOnly } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Get all data for home page - protected with authentication and admin-only access
router.get('/', protect, adminOnly, getHomeData);

export default router;