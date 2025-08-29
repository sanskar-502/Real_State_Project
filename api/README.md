# Real Estate API Documentation

A comprehensive Node.js/Express REST API for the real estate platform, providing authentication, property management, chat functionality, and geolocation services.

## 🚀 Features

- **User Authentication & Authorization** with JWT tokens
- **Property Management** (CRUD operations)
- **Advanced Search & Filtering** with security validations
- **Chat System** integration with Socket.IO
- **Geocoding Services** for property locations
- **File Upload Support** for property images
- **Security Measures** against common vulnerabilities
- **Database ORM** with Prisma and MongoDB

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🔧 Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanskar-502/Real_State_Project
   cd Real_State_Project/api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb://username:password@localhost:27017/realestate"

# JWT Secret
JWT_SECRET_KEY="your-super-secure-jwt-secret-key"

# CORS
CLIENT_URL="http://localhost:3000"

# Server
PORT=8800

# External APIs (if applicable)
GEOCODING_API_KEY="your-geocoding-api-key"
```

## 🗄️ Database Setup

### Prisma Schema Overview

The API uses MongoDB with Prisma ORM. Key models include:

- **User**: Authentication and profile management
- **Post**: Property listings with details
- **PostDetail**: Extended property information
- **SavedPost**: User's saved properties
- **Chat**: Chat system for user communication
- **Message**: Individual chat messages

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# View database in Prisma Studio
npx prisma studio

# Seed database (optional)
npm run seed
```

## 🛠️ API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration | No |
| POST | `/login` | User login | No |
| POST | `/logout` | User logout | Yes |

**Register Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login Request:**
```json
{
  "username": "johndoe",
  "password": "securePassword123"
}
```

### Property Routes (`/api/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all properties with filters | No |
| GET | `/:id` | Get single property | No |
| POST | `/` | Create new property | Yes |
| PUT | `/:id` | Update property | Yes (Owner) |
| DELETE | `/:id` | Delete property | Yes (Owner) |

**Property Filters (Query Parameters):**
- `city`: Filter by city name
- `type`: Filter by listing type (buy/rent)
- `property`: Filter by property type (apartment/house/condo/land)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `bedroom`: Number of bedrooms

**Create Property Request:**
```json
{
  "postData": {
    "title": "Beautiful 3BR Apartment",
    "price": 500000,
    "address": "123 Main St, Mumbai",
    "city": "Mumbai",
    "bedroom": 3,
    "bathroom": 2,
    "latitude": "19.0760",
    "longitude": "72.8777",
    "type": "buy",
    "property": "apartment",
    "images": ["image1.jpg", "image2.jpg"]
  },
  "postDetail": {
    "desc": "Spacious apartment with great amenities",
    "utilities": "Included",
    "pet": "Allowed",
    "income": "40000+",
    "size": 1200,
    "school": 5,
    "bus": 2,
    "restaurant": 8
  }
}
```

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all users | Yes (Admin) |
| GET | `/:id` | Get user profile | Yes |
| PUT | `/:id` | Update user profile | Yes (Owner) |
| DELETE | `/:id` | Delete user | Yes (Owner) |
| POST | `/:id/save` | Save/unsave property | Yes |
| GET | `/profile/posts` | Get user's properties | Yes |

### Chat Routes (`/api/chats`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user chats | Yes |
| GET | `/:id` | Get single chat | Yes |
| POST | `/` | Create new chat | Yes |
| PUT | `/:id/read` | Mark chat as read | Yes |

### Message Routes (`/api/messages`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/:chatId` | Add message to chat | Yes |

### Geocoding Routes (`/api/geocode`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/search` | Geocode address | No |

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Registration/Login**: Returns JWT token in HTTP-only cookie
2. **Protected Routes**: Require valid JWT token
3. **Token Expiration**: Configurable expiration time
4. **Middleware**: `verifyToken` middleware for route protection

### Authentication Middleware

```javascript
// Protected route example
app.use("/api/posts", verifyToken, postRoute);

// Usage in controller
const createPost = async (req, res) => {
  // req.userId available after token verification
  const newPost = await prisma.post.create({
    data: {
      ...postData,
      userId: req.userId
    }
  });
};
```

## 🛡️ Security Features

### Input Validation & Sanitization

- **Price Input Security**: Protection against integer overflow
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Restricted to allowed origins

### Price Filtering Security

```javascript
// Safe integer parsing with validation
const safeParseInt = (value, max = 10000000000, min = 0) => {
  // Multiple validation layers:
  // 1. Length validation (max 15 digits)
  // 2. Format validation (numeric only)
  // 3. Range clamping (0 to 10 billion)
  // 4. Overflow protection
};
```

### Authentication Security

- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure secret keys and expiration
- **HTTP-only Cookies**: Prevents XSS attacks
- **CORS Protection**: Restricted origins

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error information",
  "statusCode": 400
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- security.test.js

# Run tests in watch mode
npm test -- --watch
```

### Test Categories

- **Security Tests**: Integer overflow protection, input validation
- **Authentication Tests**: Login, registration, token validation
- **API Tests**: Endpoint functionality and error handling
- **Integration Tests**: Database operations and middleware

## 🚀 Deployment

### Production Environment Variables

```env
# Production settings
NODE_ENV=production
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/realestate"
JWT_SECRET_KEY="your-production-jwt-secret"
CLIENT_URL="https://yourdomain.com"
PORT=8800
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 8800

CMD ["npm", "start"]
```

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review security measures for security-related questions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
