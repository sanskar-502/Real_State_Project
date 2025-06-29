# 🏠 Real Estate Platform - API Backend

This is the Node.js/Express backend API for the Real Estate Platform. It provides RESTful endpoints for property management, user authentication, and real-time messaging capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for image uploads)

### Installation
```bash
cd api
npm install
```

### Environment Setup
Create a `.env` file in the api directory:
```env
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
CLIENT_URL="http://localhost:5173"
```

### Database Setup
```bash
npx prisma generate
npx prisma db push
```

### Development
```bash
npm start
```

The API server will be available at `http://localhost:8800`

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Database ORM with MongoDB support
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image upload and management
- **Socket.io** - Real-time messaging (separate server)

## 📁 Project Structure

```
api/
├── controllers/         # Route controllers
│   ├── auth.controller.js    # Authentication logic
│   ├── chat.controller.js    # Chat management
│   ├── message.controller.js # Message handling
│   ├── post.controller.js    # Property CRUD operations
│   ├── test.controller.js    # Testing endpoints
│   └── user.controller.js    # User management
├── middleware/          # Custom middleware
│   └── verifyToken.js   # JWT token verification
├── routes/             # API route definitions
│   ├── auth.route.js    # Authentication routes
│   ├── chat.route.js    # Chat routes
│   ├── message.route.js # Message routes
│   ├── post.route.js    # Property routes
│   ├── test.route.js    # Test routes
│   └── user.route.js    # User routes
├── prisma/             # Database configuration
│   └── schema.prisma    # Database schema
├── lib/                # Utility libraries
│   └── prisma.js       # Prisma client configuration
└── app.js              # Main server file
```

## 🔧 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

### Users (`/api/users`)
- `GET /:id` - Get user profile
- `PUT /:id` - Update user profile
- `DELETE /:id` - Delete user account

### Posts (`/api/posts`)
- `GET /` - Get all posts with filters
- `POST /` - Create new property listing
- `GET /:id` - Get single property
- `PUT /:id` - Update property
- `DELETE /:id` - Delete property

### Chats (`/api/chats`)
- `GET /` - Get user's chats
- `POST /` - Create new chat

### Messages (`/api/messages`)
- `GET /:chatId` - Get chat messages
- `POST /` - Send new message

## 📊 Database Schema

### User Model
```prisma
model User {
  id         String      @id @default(auto()) @map("_id") @db.ObjectId
  email      String      @unique
  username   String      @unique
  password   String
  avatar     String?
  createdAt  DateTime    @default(now())
  posts      Post[]
  savedPosts SavedPost[]
  chats      Chat[]      @relation(fields: [chatIDs], references: [id])
  chatIDs    String[]    @db.ObjectId
}
```

### Post Model
```prisma
model Post {
  id         String      @id @default(auto()) @map("_id") @db.ObjectId
  title      String
  price      Int
  images     String[]
  address    String
  city       String
  bedroom    Int
  bathroom   Int
  latitude   String
  longitude  String
  type       Type
  property   Property
  createdAt  DateTime    @default(now())
  user       User        @relation(fields: [userId], references: [id])
  userId     String      @db.ObjectId
  postDetail PostDetail?
  savedPosts SavedPost[]
}
```

### Chat & Message Models
```prisma
model Chat {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  users     User[]    @relation(fields: [userIDs], references: [id])
  userIDs   String[]  @db.ObjectId
  createdAt DateTime  @default(now())
  seenBy    String[]  @db.ObjectId
  messages  Message[]
  lastMessage String?
}

model Message {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  text      String
  userId    String
  chat      Chat     @relation(fields: [chatId], references: [id])
  chatId    String   @db.ObjectId
  createdAt DateTime @default(now())
}
```

## 🔒 Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token verification middleware
- Secure cookie handling

### Data Validation
- Input sanitization
- Request validation
- Error handling middleware

### CORS Configuration
- Cross-origin resource sharing
- Credential support
- Configurable origins

## 🗄️ Database Operations

### Prisma ORM
- Type-safe database queries
- Automatic migrations
- Connection pooling
- MongoDB integration

### Key Operations
- User CRUD operations
- Property listing management
- Chat and message handling
- Image upload processing

## 📡 Real-time Features

### Socket.io Integration
- Separate socket server for real-time messaging
- Online user tracking
- Message delivery notifications
- Chat room management

## 🚀 Performance Optimizations

### Database
- Indexed queries for better performance
- Connection pooling
- Efficient data relationships

### API
- Request rate limiting
- Response caching
- Optimized queries
- Error handling

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary configuration
- `CLIENT_URL` - Frontend URL for CORS

### Database Configuration
- MongoDB Atlas or local MongoDB
- Prisma schema management
- Migration handling

## 📝 API Documentation

### Request/Response Format
All API endpoints return JSON responses with the following structure:
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

### Error Handling
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## 🧪 Testing

### Test Endpoints
- `GET /api/test` - Health check
- Additional test routes for development

### Manual Testing
- Use Postman or similar tools
- Test all CRUD operations
- Verify authentication flow

## 🚀 Deployment

### Production Setup
1. Set up MongoDB Atlas
2. Configure Cloudinary
3. Set environment variables
4. Deploy to hosting platform

### Environment Variables for Production
```env
DATABASE_URL="mongodb+srv://..."
JWT_SECRET="production_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLIENT_URL="https://your-frontend-domain.com"
```

## 📊 Monitoring

### Logging
- Request logging
- Error tracking
- Performance monitoring

### Health Checks
- Database connectivity
- API endpoint status
- Service availability

## 🤝 Contributing

1. Follow the existing code style
2. Add appropriate error handling
3. Update API documentation
4. Test all endpoints thoroughly

## 📝 License

This project is licensed under the ISC License. 