import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/api/profiles.js";
import homeRoutes from "./routes/api/home.js";
import seedRoutes from "./routes/api/seed.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const port = process.env.PORT || 3001;
const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Routes
    app.use("/auth", authRoutes);
    app.use("/api/profiles", profileRoutes);
    app.use("/api/home", homeRoutes);
    app.use("/api/seed", seedRoutes);
    
    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
      // Set static folder
      app.use(express.static(path.join(__dirname, '/client/build')));
      
      // Any route that is not API will be redirected to index.html
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api') && !req.path.startsWith('/auth')) {
          res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        } else {
          res.status(404).json({ message: 'Route not found' });
        }
      });
    } else {
      // Welcome route with available routes (development only)
      app.get("/", (req, res) => {
        res.send(`
          <html>
            <head>
              <title>Judge-ing API</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  margin: 20px;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                }
                h1 {
                  color: #333;
                  border-bottom: 1px solid #eee;
                  padding-bottom: 10px;
                }
                h2 {
                  color: #555;
                  margin-top: 20px;
                }
                ul {
                  list-style-type: none;
                  padding-left: 10px;
                }
                li {
                  margin-bottom: 8px;
                }
                .method {
                  display: inline-block;
                  width: 60px;
                  font-weight: bold;
                  color: #1a73e8;
                }
                .route {
                  color: #333;
                  font-family: monospace;
                }
                .description {
                  color: #666;
                  margin-left: 10px;
                }
              </style>
            </head>
            <body>
              <h1>Welcome to Judge-ing API</h1>
              <p>Server is connected and running successfully.</p>
              
              <h2>Available Routes:</h2>
              
              <h3>Authentication:</h3>
              <ul>
                <li><span class="method">POST</span> <span class="route">/auth/register</span> <span class="description">- Register a new user</span></li>
                <li><span class="method">POST</span> <span class="route">/auth/login</span> <span class="description">- User login</span></li>
              </ul>
              
              <h3>Profiles:</h3>
              <ul>
                <li><span class="method">GET</span> <span class="route">/api/profiles</span> <span class="description">- Get all profiles</span></li>
                <li><span class="method">GET</span> <span class="route">/api/profiles/:id</span> <span class="description">- Get profile by ID</span></li>
                <li><span class="method">POST</span> <span class="route">/api/profiles</span> <span class="description">- Create a new profile</span></li>
                <li><span class="method">PUT</span> <span class="route">/api/profiles/:id</span> <span class="description">- Update a profile</span></li>
                <li><span class="method">DELETE</span> <span class="route">/api/profiles/:id</span> <span class="description">- Delete a profile</span></li>
              </ul>
              
              <h3>Home:</h3>
              <ul>
                <li><span class="method">GET</span> <span class="route">/api/home</span> <span class="description">- Get all data for the main page</span></li>
              </ul>
              
              <h3>Seed Data:</h3>
              <ul>
                <li><span class="method">POST</span> <span class="route">/api/seed/users</span> <span class="description">- Seed users data from JSON file to MongoDB</span></li>
                <li><span class="method">POST</span> <span class="route">/api/seed/profiles/pickleball</span> <span class="description">- Seed pickleball judge profiles to MongoDB</span></li>
              </ul>
            </body>
          </html>
        `);
      });
    }
    
    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
