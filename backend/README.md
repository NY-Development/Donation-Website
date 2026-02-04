# Donation Website - Backend API

A robust Express.js backend API for the Donation Website platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: CRUD operations for user accounts
- **Campaign Management**: Create and manage donation campaigns
- **Donation Processing**: Handle donation transactions
- **Input Validation**: Request validation using Zod
- **Error Handling**: Centralized error handling with custom error classes
- **Rate Limiting**: API rate limiting for security
- **Logging**: Structured logging for debugging and monitoring

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── database.js        # Prisma client configuration
│   │   └── environment.js     # Environment variables
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── campaign.controller.js
│   │   ├── donation.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── authenticate.js    # JWT authentication
│   │   ├── authorize.js       # Role-based authorization
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── notFoundHandler.js # 404 handler
│   │   ├── rateLimiter.js     # Rate limiting
│   │   └── validateRequest.js # Request validation
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── campaign.routes.js
│   │   ├── donation.routes.js
│   │   ├── index.js
│   │   └── user.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── campaign.service.js
│   │   ├── donation.service.js
│   │   └── user.service.js
│   ├── utils/
│   │   ├── apiResponse.js     # Standardized API responses
│   │   ├── appError.js        # Custom error class
│   │   ├── asyncHandler.js    # Async error wrapper
│   │   ├── constants.js       # Application constants
│   │   ├── helpers.js         # Utility functions
│   │   ├── logger.js          # Logging utility
│   │   └── pagination.js      # Pagination helpers
│   ├── validation/
│   │   ├── auth.validation.js
│   │   ├── campaign.validation.js
│   │   ├── donation.validation.js
│   │   └── user.validation.js
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/refresh-token` | Refresh JWT token |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users/me` | Get current user | ✅ |
| PUT | `/api/v1/users/me` | Update current user | ✅ |
| DELETE | `/api/v1/users/me` | Delete current user | ✅ |
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | Admin |
| PUT | `/api/v1/users/:id` | Update user | Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |

### Campaigns
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/campaigns` | Get all campaigns | ❌ |
| GET | `/api/v1/campaigns/featured` | Get featured campaigns | ❌ |
| GET | `/api/v1/campaigns/:id` | Get campaign by ID | ❌ |
| POST | `/api/v1/campaigns` | Create campaign | Admin |
| PUT | `/api/v1/campaigns/:id` | Update campaign | Admin |
| DELETE | `/api/v1/campaigns/:id` | Delete campaign | Admin |

### Donations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/donations` | Get all donations | ❌ |
| GET | `/api/v1/donations/stats` | Get donation statistics | ❌ |
| GET | `/api/v1/donations/:id` | Get donation by ID | ❌ |
| POST | `/api/v1/donations` | Create donation | ✅ |
| GET | `/api/v1/donations/user/history` | Get user's donations | ✅ |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health check |

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection URL | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

## 🗄️ Database Schema

### User
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `role` (Enum: USER, ADMIN)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Campaign
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `goalAmount` (Float)
- `currentAmount` (Float)
- `startDate` (DateTime)
- `endDate` (DateTime)
- `imageUrl` (String, Optional)
- `featured` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Donation
- `id` (UUID, Primary Key)
- `amount` (Float)
- `message` (Text, Optional)
- `anonymous` (Boolean)
- `status` (Enum: PENDING, COMPLETED, FAILED, REFUNDED)
- `userId` (UUID, Foreign Key)
- `campaignId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## 🧪 Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Run linting
npm run lint

# Run tests
npm test
```

## 📄 License

ISC
