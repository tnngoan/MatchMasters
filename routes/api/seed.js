import express from 'express';
import { seedUsers, seedPickleballProfiles } from '../../controllers/seedController.js';

const router = express.Router();

// POST request to seed users data to MongoDB
router.post('/users', seedUsers);

// POST request to seed pickleball judge profiles to MongoDB
router.post('/profiles/pickleball', seedPickleballProfiles);

export default router;