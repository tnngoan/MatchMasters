import { User } from '../models/User.js';
import Profile from '../models/Profile.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to strip comments from a JSON string
const stripComments = (jsonString) => {
  // Remove single-line comments (both // and // at the beginning of a line)
  let result = jsonString.replace(/^\s*\/\/.*$/gm, '');
  // Also remove comments that appear after content on the same line
  result = result.replace(/\/\/.*$/gm, '');
  return result;
};

// @desc    Seed users from JSON file to MongoDB
// @route   POST /api/seed/users
// @access  Public (in production, this should be restricted)
const seedUsers = async (req, res) => {
  try {
    // Read users from JSON file
    const usersPath = path.join(__dirname, '..', 'users.json');
    const usersData = await fs.readFile(usersPath, 'utf8');
    const cleanUsersData = stripComments(usersData);
    const users = JSON.parse(cleanUsersData);

    console.log(`Attempting to seed ${users.length} users...`);

    // Clear existing users if requested
    if (req.query.clear === 'true') {
      console.log('Clearing existing users...');
      await User.deleteMany({});
    }

    // Insert users into MongoDB
    const insertedUsers = [];
    for (const user of users) {
      // Check if user already exists to avoid duplicates
      const existingUser = await User.findOne({ email: user.email });
      
      if (existingUser) {
        console.log(`User with email ${user.email} already exists, skipping`);
        continue;
      }

      // Create a new user with the specified _id
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(user._id),
        email: user.email,
        password: user.password, // Already hashed in the JSON file
        role: user.role
      });

      await newUser.save();
      insertedUsers.push({ email: user.email, role: user.role, _id: user._id });
    }

    res.status(201).json({
      message: `Successfully seeded ${insertedUsers.length} users into MongoDB`,
      insertedUsers
    });
  } catch (error) {
    console.error('Error seeding users:', error);
    res.status(500).json({
      message: 'Error seeding users',
      error: error.message
    });
  }
};

// @desc    Seed pickleball judge profiles to MongoDB
// @route   POST /api/seed/profiles/pickleball
// @access  Public (in production, this should be restricted)
const seedPickleballProfiles = async (req, res) => {
  try {
    // First, check if users exist in the database
    const users = await User.find({ role: 'judge' }).select('_id email');
    
    if (users.length === 0) {
      return res.status(400).json({
        message: 'No judge users found in the database. Please seed users first.',
      });
    }

    console.log(`Found ${users.length} judge users to associate with profiles`);
    
    // Clear existing profiles if requested
    if (req.query.clear === 'true') {
      console.log('Clearing existing profiles...');
      await Profile.deleteMany({});
    }
    
    // Sample pickleball judge profiles data
    const pickleballProfiles = [
      {
        name: "Alex Rodriguez",
        sports: ["Pickleball", "Tennis", "Badminton"],
        certifications: ["USA Pickleball Certified Referee", "IPTPA Level II Instructor"],
        experience: 8,
        hourlyRate: 65,
        availability: [
          { date: new Date("2025-04-20T09:00:00Z"), isAvailable: true },
          { date: new Date("2025-04-21T09:00:00Z"), isAvailable: true },
          { date: new Date("2025-04-22T09:00:00Z"), isAvailable: false }
        ],
        bio: "Professional pickleball referee with 8 years of experience. Certified USA Pickleball referee with experience officiating national tournaments and championships.",
        contactInfo: {
          phone: "555-123-4567",
          email: users[0]?.email || "alex.rodriguez@example.com"
        },
        ratings: [
          {
            score: 4.8,
            comment: "Alex was excellent - consistent calls and great communication with players.",
            eventId: new mongoose.Types.ObjectId()
          }
        ]
      },
      {
        name: "Samantha Chen",
        sports: ["Pickleball", "Table Tennis"],
        certifications: ["APP Tour Certified Official", "PPF Referee Level 3"],
        experience: 5,
        hourlyRate: 60,
        availability: [
          { date: new Date("2025-04-20T09:00:00Z"), isAvailable: false },
          { date: new Date("2025-04-21T09:00:00Z"), isAvailable: true },
          { date: new Date("2025-04-22T09:00:00Z"), isAvailable: true }
        ],
        bio: "APP Tour certified pickleball official with specialization in advanced tournament formats. Experienced in enforcing complex rule sets and maintaining fair play.",
        contactInfo: {
          phone: "555-234-5678",
          email: users[1]?.email || "samantha.chen@example.com"
        },
        ratings: [
          {
            score: 4.9,
            comment: "Samantha's knowledge of the rules is exceptional. Perfect officiating for our club championship.",
            eventId: new mongoose.Types.ObjectId()
          }
        ]
      },
      {
        name: "Marcus Johnson",
        sports: ["Pickleball", "Basketball"],
        certifications: ["USAPA Referee Certification", "Pickleball Rocks Certified Official"],
        experience: 6,
        hourlyRate: 55,
        availability: [
          { date: new Date("2025-04-20T09:00:00Z"), isAvailable: true },
          { date: new Date("2025-04-21T09:00:00Z"), isAvailable: true },
          { date: new Date("2025-04-22T09:00:00Z"), isAvailable: true }
        ],
        bio: "Former basketball referee who transitioned to pickleball officiating. Specializes in maintaining court control and managing complex match situations.",
        contactInfo: {
          phone: "555-345-6789",
          email: users[2]?.email || "marcus.johnson@example.com"
        },
        ratings: [
          {
            score: 4.7,
            comment: "Marcus handled a very tense match with professionalism and fairness.",
            eventId: new mongoose.Types.ObjectId()
          }
        ]
      },
      {
        name: "Lisa Patel",
        sports: ["Pickleball", "Tennis", "Racquetball"],
        certifications: ["IFP Certified Referee", "Professional Pickleball Registry Official"],
        experience: 7,
        hourlyRate: 70,
        availability: [
          { date: new Date("2025-04-20T09:00:00Z"), isAvailable: false },
          { date: new Date("2025-04-21T09:00:00Z"), isAvailable: false },
          { date: new Date("2025-04-22T09:00:00Z"), isAvailable: true }
        ],
        bio: "International Pickleball Federation certified referee with experience officiating worldwide. Expert in international rule variations and tournament formats.",
        contactInfo: {
          phone: "555-456-7890",
          email: users[3]?.email || "lisa.patel@example.com"
        },
        ratings: [
          {
            score: 4.9,
            comment: "Lisa's attention to detail made our international tournament run flawlessly.",
            eventId: new mongoose.Types.ObjectId()
          }
        ]
      },
      {
        name: "David Wilson",
        sports: ["Pickleball", "Volleyball"],
        certifications: ["USA Pickleball Line Judge Certification", "PPA Tour Official"],
        experience: 4,
        hourlyRate: 50,
        availability: [
          { date: new Date("2025-04-20T09:00:00Z"), isAvailable: true },
          { date: new Date("2025-04-21T09:00:00Z"), isAvailable: true },
          { date: new Date("2025-04-22T09:00:00Z"), isAvailable: false }
        ],
        bio: "PPA Tour official with expertise in line judging and video replay systems. Experience with electronic scoring and advanced tournament software.",
        contactInfo: {
          phone: "555-567-8901",
          email: users[4]?.email || "david.wilson@example.com"
        },
        ratings: [
          {
            score: 4.6,
            comment: "David's use of technology and replay systems enhanced our tournament experience.",
            eventId: new mongoose.Types.ObjectId()
          }
        ]
      }
    ];
    
    // Insert profiles into MongoDB
    const insertedProfiles = [];
    for (let i = 0; i < pickleballProfiles.length; i++) {
      const profile = pickleballProfiles[i];
      // Try to use an existing judge user
      const userId = users[i]?._id || users[0]._id;
      
      // Check if a profile already exists for this user
      const existingProfile = await Profile.findOne({ userId });
      
      if (existingProfile) {
        console.log(`Profile for user ${userId} already exists, skipping`);
        continue;
      }
      
      // Create new profile
      const newProfile = new Profile({
        userId,
        ...profile
      });
      
      await newProfile.save();
      insertedProfiles.push({ 
        _id: newProfile._id,
        name: profile.name, 
        sports: profile.sports,
        userId 
      });
    }
    
    res.status(201).json({
      message: `Successfully seeded ${insertedProfiles.length} pickleball judge profiles into MongoDB`,
      insertedProfiles
    });
  } catch (error) {
    console.error('Error seeding pickleball profiles:', error);
    res.status(500).json({
      message: 'Error seeding pickleball profiles',
      error: error.message
    });
  }
};

export { seedUsers, seedPickleballProfiles };