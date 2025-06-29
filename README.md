# 🏠 Real Estate Platform

A comprehensive full-stack real estate platform built with modern web technologies. This application allows users to browse, search, and manage real estate listings with features like real-time messaging, user authentication, and interactive maps.

## ✨ Features

### 🏘️ Property Management
- **Property Listings**: Browse apartments, houses, condos, and land
- **Advanced Search**: Filter by location, price, property type, and amenities
- **Interactive Maps**: View properties on an interactive map using Leaflet
- **Property Details**: Comprehensive property information including utilities, pet policies, and nearby amenities
- **Save Properties**: Bookmark favorite properties for later viewing

### 👤 User Features
- **User Authentication**: Secure registration and login system
- **User Profiles**: Manage personal information and avatar
- **Property Posting**: Create and manage your own property listings
- **Saved Properties**: Keep track of favorite listings

### 💬 Real-time Communication
- **Instant Messaging**: Real-time chat between users using Socket.io
- **Message Notifications**: Get notified of new messages instantly
- **Chat History**: View conversation history with other users

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean and intuitive interface with SCSS styling
- **Interactive Components**: Dynamic search bars, filters, and sliders
- **Image Upload**: Cloudinary integration for property images

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **SCSS** - Advanced CSS styling
- **Leaflet** - Interactive maps
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **Zustand** - State management
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Database ORM
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Socket.io** - Real-time messaging

### Additional Tools
- **Cloudinary** - Image upload and management
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
full-stack-estate/
├── api/                    # Backend API server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   ├── prisma/            # Database schema
│   └── app.js             # Main server file
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── routes/        # Page components
│   │   ├── context/       # React context providers
│   │   └── lib/           # Utility functions
│   └── public/            # Static assets
└── socket/                # Socket.io server
    └── app.js             # Real-time messaging server
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd full-stack-estate
   ```

2. **Install dependencies for all services**
   ```bash
   # Install API dependencies
   cd api
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   
   # Install socket dependencies
   cd ../socket
   npm install
   ```

3. **Set up environment variables**

   Create `.env` files in the `api` directory:
   ```env
   DATABASE_URL="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret_key"
   CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   CLIENT_URL="http://localhost:5173"
   ```

4. **Set up the database**
   ```bash
   cd api
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development servers**

   In separate terminal windows:
   ```bash
   # Start the API server (port 8800)
   cd api
   npm start
   
   # Start the client development server (port 5173)
   cd client
   npm run dev
   
   # Start the socket server (port 4000)
   cd socket
   node app.js
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - API: http://localhost:8800
   - Socket: http://localhost:4000

## 📊 Database Schema

The application uses MongoDB with the following main entities:

- **User**: User accounts with authentication
- **Post**: Property listings with details
- **PostDetail**: Extended property information
- **SavedPost**: User's saved properties
- **Chat**: Messaging conversations
- **Message**: Individual chat messages

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### Posts
- `GET /api/posts` - Get all posts with filters
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Chats & Messages
- `GET /api/chats` - Get user chats
- `POST /api/chats` - Create new chat
- `GET /api/messages/:chatId` - Get chat messages
- `POST /api/messages` - Send message

## 🎯 Key Features Implementation

### Real-time Messaging
- Socket.io implementation for instant messaging
- Online user tracking
- Message delivery notifications

### Interactive Maps
- Leaflet integration for property location visualization
- Custom map markers for properties
- Location-based search functionality

### Image Management
- Cloudinary integration for image uploads
- Multiple image support for property listings
- Optimized image delivery

### Search & Filtering
- Advanced search with multiple criteria
- Real-time filtering
- Location-based search

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
```

### Backend Deployment
- Deploy the API server to your preferred hosting platform
- Set up environment variables on the hosting platform
- Configure CORS settings for production

### Database
- Set up MongoDB Atlas or your preferred MongoDB hosting
- Update the DATABASE_URL in your environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Real Estate Platform - A modern full-stack real estate application

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: Make sure to replace placeholder values (like API keys, database URLs) with your actual credentials before running the application. 
