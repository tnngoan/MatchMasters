# Judge-ing

A platform connecting judges with event organizers for competitions and events.

## Project Structure

```
├── config/            # Configuration files
│   └── database.js    # Database connection configuration
├── controllers/       # Controller logic
│   ├── authController.js    # Authentication logic
│   └── profileController.js # Profile management
├── middlewares/       # Middleware functions
│   ├── authMiddleware.js    # JWT authentication
│   └── errorMiddleware.js   # Error handling
├── models/            # Database models
│   ├── Profile.js     # Profile schema
│   └── User.js        # User schema
├── routes/            # API routes
│   ├── auth.js        # Authentication routes
│   └── api/           # API endpoints
│       └── profiles.js # Profile routes
├── .env.example       # Example environment variables
├── index.js           # Main application entry point
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Copy .env.example to .env and update values
   ```bash
   cp .env.example .env
   ```
4. Start the server
   ```bash
   npm run dev
   ```

## API Routes

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Login and get JWT token
- GET /auth/profile - Get user profile (requires authentication)

### Profiles
- GET /api/profiles - Get all profiles
- GET /api/profiles/:id - Get profile by ID
- POST /api/profiles - Create a profile (requires authentication)
- PUT /api/profiles/:id - Update a profile (requires authentication)

## License

ISC