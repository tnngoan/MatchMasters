import dotenv from "dotenv";
dotenv.config();
import { User } from "./models/User.js"; // Corrected path
import profilesData from "./profiles.json";
import Profile from "./models/Profile.js";
import express from "express";
import path from "path";
import { connect } from "mongoose";
import router from "./routes/auth.js"; // Corrected path
import { join } from "path";
import { readFileSync } from "fs";
import cors from "cors";
const __dirname = path.resolve();
const port = process.env.PORT || 3000;
const app = express();
const mongoURI = process.env.MONGODB_URI;
app.use(cors());
app.use(express.json());

app.use(express.json());
connect(mongoURI, {})
  .then(async () => {
    console.log("Connected to MongoDB");

    // Read profiles.json file
    const profilesFilePath = join(__dirname, "profiles.json");
    const profilesData = JSON.parse(readFileSync(profilesFilePath, "utf8"));
// define insertMany function
const insertMany = async (profilesData) => {
  try {
    await User.insertMany(profilesData);
  } catch (err) {
    console.log("Failed to insert profiles", err);
  }
}

// Insert profiles into MongoDB
await insertMany(profilesData);
console.log("Profiles inserted successfully");
    // Insert profiles into MongoDB
    await insertMany(profilesData);
    console.log("Profiles inserted successfully");
    // Use the auth routes
    app.use("/auth", router); // Corrected path
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

// Define a route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
