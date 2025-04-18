import { User } from "../models/User.js";
import Profile from "../models/Profile.js";
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Convert JS object syntax to valid JSON
const jsToJson = (jsString) => {
  try {
    // First, extract just the array content from the MongoDB insertMany command
    const match = jsString.match(/db\.events\.insertMany\(\[([\s\S]*)\]\);/);
    if (match && match[1]) {
      let content = match[1];
      
      // Replace unquoted property names with quoted ones
      content = content.replace(/(\s+)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3');
      
      // Replace ObjectId() with just the ID string
      content = content.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
      
      // Replace new Date() with ISO date string
      content = content.replace(/new Date\("([^"]+)"\)/g, '"$1"');
      
      // Return as a JSON array
      return "[" + content + "]";
    }
    return jsString;
  } catch (error) {
    console.error("Error in jsToJson conversion:", error);
    return jsString;
  }
};

// @desc    Get all data for home page
// @route   GET /api/home
// @access  Private/Admin (restricted to ngoan.n.tr@gmail.com)
const getHomeData = async (req, res) => {
  try {
    // User is already verified by middleware as ngoan.n.tr@gmail.com
    let users, profiles, events, bookings;
    
    // Try reading from database first, fallback to JSON files if database is not available
    try {
      // Get users from database
      users = await User.find({}).select('-password');
      console.log('Users from database:', users.length);
      
      // Get profiles from database
      profiles = await Profile.find({});
    } catch (dbError) {
      console.log('Database read error, falling back to JSON files:', dbError.message);
      
      // Read users from JSON file
      const usersPath = path.join(__dirname, '..', 'users.json');
      const usersData = await fs.readFile(usersPath, 'utf8');
      const cleanUsersData = stripComments(usersData);
      users = JSON.parse(cleanUsersData);
      console.log('Users from JSON file:', users.length);
      
      // Read profiles from JSON file
      const profilesPath = path.join(__dirname, '..', 'profiles.json');
      const profilesData = await fs.readFile(profilesPath, 'utf8');
      const cleanProfilesData = stripComments(profilesData);
      profiles = JSON.parse(cleanProfilesData);
    }
    
    // Read and parse events - use a different approach
    try {
      // First try to use the pre-processed events.json if it exists
      const processedEventsPath = path.join(__dirname, '..', 'processed-events.json');
      try {
        const processedEventsData = await fs.readFile(processedEventsPath, 'utf8');
        events = JSON.parse(processedEventsData);
        console.log('Successfully loaded events from processed-events.json');
      } catch (processedError) {
        // If processed file doesn't exist, use the original events.json with custom parsing
        console.log('Processed events file not found, using original events.json with custom parsing');
        const eventsPath = path.join(__dirname, '..', 'events.json');
        const eventsData = await fs.readFile(eventsPath, 'utf8');
        
        // Clean and convert to valid JSON
        const cleanEventsData = stripComments(eventsData);
        const jsonEventsData = jsToJson(cleanEventsData);
        
        try {
          events = JSON.parse(jsonEventsData);
          
          // Create the processed-events.json file for future use
          await fs.writeFile(processedEventsPath, JSON.stringify(events, null, 2), 'utf8');
          console.log('Created processed-events.json for future use');
        } catch (parseError) {
          console.error('Error parsing events JSON:', parseError);
          
          // Provide a fallback minimal events array
          events = [
            {
              "_id": "62d0fe4f5311236168a109ea",
              "title": "National Moot Court Competition",
              "description": "Annual competition bringing together law students from across the country.",
              "status": "upcoming",
              "startDate": "2024-04-15T09:00:00Z",
              "endDate": "2024-04-18T17:00:00Z"
            },
            {
              "_id": "71d5ec9af682727af9612361",
              "name": "Bay Area Basketball Tournament",
              "sport": "Basketball",
              "status": "upcoming",
              "startDate": "2025-05-15T08:00:00.000Z",
              "endDate": "2025-05-17T18:00:00.000Z"
            }
          ];
        }
      }
    } catch (eventsError) {
      console.error('Error handling events:', eventsError);
      events = [];  // Empty array as fallback
    }
    
    // Read bookings from JSON file
    try {
      const bookingsPath = path.join(__dirname, '..', 'bookings.json');
      const bookingsData = await fs.readFile(bookingsPath, 'utf8');
      const cleanBookingsData = stripComments(bookingsData);
      bookings = JSON.parse(cleanBookingsData);
    } catch (bookingsError) {
      console.error('Error parsing bookings JSON:', bookingsError);
      bookings = [];  // Empty array as fallback
    }

    res.json({
      users,
      profiles,
      events,
      bookings,
      timestamp: new Date(),
      message: "All data retrieved successfully"
    });
  } catch (error) {
    console.error('Home data error:', error);
    res.status(500).json({
      message: 'Error retrieving home data',
      error: error.message
    });
  }
};

export { getHomeData };