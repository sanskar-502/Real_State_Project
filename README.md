# 🏠 Real Estate Platform

A comprehensive, full-stack real estate platform built with modern web technologies, featuring property listings, real-time chat, interactive maps, and advanced search capabilities. This platform provides a seamless experience for property buyers, sellers, and real estate agents.

## ✨ Key Features

### 🔍 **Advanced Property Search**
- Multi-criteria filtering (location, price, property type, bedrooms)
- Interactive map integration with property markers
- Intelligent search with autocomplete
- Mobile-responsive search interface
- Real-time search results

### 💬 **Real-time Communication**
- Instant messaging between users
- Online presence indicators
- Chat history persistence
- Message delivery confirmations
- Mobile-optimized chat interface

### 🗺️ **Interactive Maps**
- Leaflet-powered property visualization
- Custom property markers with details
- Location-based search
- Zoom and pan capabilities
- Mobile touch support

### 👤 **User Management**
- Secure authentication system
- User profiles with avatars
- Property management dashboard
- Saved properties functionality
- Account settings and preferences

### 🏡 **Property Management**
- Create and edit property listings
- Multiple image upload support
- Rich text descriptions
- Property details and amenities
- Pricing and availability management

### 📱 **Mobile-First Design**
- Responsive design for all screen sizes
- Touch-friendly interfaces
- Optimized mobile navigation
- Mobile-specific interactions
- Progressive Web App capabilities

### 🛡️ **Security Features**
- JWT-based authentication
- Input validation and sanitization
- Protection against integer overflow attacks
- XSS and CSRF protection
- Secure password handling with bcrypt

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Client  │◄──►│  Express API    │◄──►│   MongoDB       │
│   (Frontend)    │    │   (Backend)     │    │  (Database)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  Socket.IO      │    │     Prisma      │    │   External      │
│  (Real-time)    │    │     (ORM)       │    │   Services      │
│                 │    │                 │    │  (Cloudinary)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend (Client):**
- **React 18** with modern hooks and concurrent features
- **Vite** for fast development and optimized builds
- **React Router DOM** for client-side routing
- **Leaflet** for interactive maps
- **Socket.IO Client** for real-time communication
- **Axios** for HTTP requests
- **SCSS** for advanced styling
- **Zustand** for state management

**Backend (API):**
- **Node.js** with Express.js framework
- **Prisma ORM** for database operations
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests
- **MongoDB** as the primary database

**Real-time (Socket):**
- **Socket.IO** for bidirectional communication
- **Event-driven architecture** for messaging
- **Connection management** for online presence

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18 or higher
- MongoDB database (local or cloud)
- Git for version control

### 1. Clone the Repository
```bash
git clone https://github.com/sanskar-502/Real_State_Project
cd Real_State_Project
```

### 2. Set Up the Backend API
```bash
cd api
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URL and JWT secret

# Set up database
npx prisma generate
npx prisma db push

# Start the API server
npm run dev
```

### 3. Set Up the Socket.IO Server
```bash
cd ../socket
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with client URL

# Start the Socket.IO server
npm run dev
```

### 4. Set Up the Frontend Client
```bash
cd ../client
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with API and Socket URLs

# Start the frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8800
- **Socket.IO**: http://localhost:4000

## 📁 Project Structure

```
Real_State_Project/
├── api/                     # Backend API Server
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── routes/             # API route definitions
│   ├── prisma/             # Database schema and migrations
│   ├── lib/                # Utility libraries
│   ├── tests/              # API tests
│   ├── app.js              # Main server file
│   ├── package.json        # API dependencies
│   └── README.md           # API documentation
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── routes/         # Page components
│   │   ├── context/        # React contexts
│   │   ├── lib/            # Utility functions
│   │   ├── styles/         # Global styles
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
├── socket/                 # Socket.IO Real-time Server
│   ├── app.js              # Socket.IO server
│   ├── package.json        # Socket dependencies
│   └── README.md           # Socket documentation
├── README.md               # This file - Project overview
├── SECURITY_MEASURES.md    # Security documentation
└── .gitignore              # Git ignore rules
```

## 🔧 Development Setup

### Environment Variables Setup

Each component requires its own environment configuration:

**API (.env):**
```env
DATABASE_URL="mongodb://localhost:27017/realestate"
JWT_SECRET_KEY="your-super-secure-jwt-secret"
CLIENT_URL="http://localhost:3000"
PORT=8800
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:8800/api
VITE_SOCKET_URL=http://localhost:4000
```

**Socket (.env):**
```env
PORT=4000
CLIENT_URL=http://localhost:3000
```

### Development Workflow

1. **Start the database** (MongoDB)
2. **Run the API server** (`api/npm run dev`)
3. **Run the Socket.IO server** (`socket/npm run dev`)
4. **Run the frontend client** (`client/npm run dev`)

## 🎯 Core Functionality

### Property Search & Filtering
- **Location-based search**: Find properties by city or area
- **Price range filtering**: Set minimum and maximum price limits
- **Property type filtering**: Apartment, house, condo, or land
- **Bedroom/bathroom filtering**: Specify desired room counts
- **Advanced filters**: Additional amenities and features

### User Authentication & Authorization
- **Registration**: Create new user accounts with email verification
- **Login/Logout**: Secure session management with JWT tokens
- **Profile management**: Update user information and preferences
- **Role-based access**: Different permissions for users and agents

### Property Management
- **Create listings**: Add new properties with detailed information
- **Edit properties**: Update listing details, pricing, and availability
- **Image management**: Upload and organize property photos
- **Property analytics**: View listing performance and engagement

### Real-time Chat System
- **Direct messaging**: One-on-one conversations between users
- **Message persistence**: Chat history stored in database
- **Online presence**: See who's currently available to chat
- **Message notifications**: Real-time alerts for new messages

## 🛡️ Security Measures

### Input Validation & Sanitization
- **Price overflow protection**: Prevents integer overflow attacks
- **Input length limits**: Restricts excessively long inputs
- **Character validation**: Allows only safe characters
- **XSS protection**: Sanitizes user-generated content

### Authentication Security
- **Password hashing**: bcrypt with salt rounds
- **JWT tokens**: Secure, stateless authentication
- **HTTP-only cookies**: Prevents XSS token theft
- **Session management**: Automatic token refresh and expiration

### API Security
- **CORS protection**: Restricts cross-origin requests
- **Rate limiting**: Prevents abuse and DoS attacks
- **Input validation**: Server-side validation for all inputs
- **Error handling**: Secure error messages without data leakage

For detailed security documentation, see [SECURITY_MEASURES.md](./SECURITY_MEASURES.md)

## 📊 Performance Features

### Frontend Optimizations
- **Code splitting**: Lazy loading of route components
- **Image optimization**: Responsive images with lazy loading
- **Bundle optimization**: Tree shaking and minification
- **Caching strategies**: Browser and API response caching

### Backend Optimizations
- **Database indexing**: Optimized queries for fast search
- **Connection pooling**: Efficient database connections
- **Response compression**: Gzipped API responses
- **Query optimization**: Efficient Prisma operations

## 🧪 Testing Strategy

### Frontend Testing
- **Component tests**: React Testing Library
- **Integration tests**: User workflow testing
- **E2E tests**: Cypress for full application testing
- **Accessibility tests**: WCAG compliance validation

### Backend Testing
- **Unit tests**: Jest for controller and utility testing
- **API tests**: Supertest for endpoint testing
- **Security tests**: Validation of input sanitization
- **Database tests**: Prisma operation testing

### Real-time Testing
- **Socket.IO tests**: Connection and messaging tests
- **Load testing**: Multiple concurrent connections
- **Message delivery tests**: Reliability and ordering

## 🚀 Deployment

### Development Environment
```bash
# Start all services in development
npm run dev:all  # Custom script to start all services

# Or start individually:
cd api && npm run dev &
cd socket && npm run dev &
cd client && npm run dev
```

### Production Deployment

#### Using Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    ports:
      - "8800:8800"
    
  socket:
    build: ./socket
    environment:
      - NODE_ENV=production
      - CLIENT_URL=${CLIENT_URL}
    ports:
      - "4000:4000"
    
  client:
    build: ./client
    environment:
      - VITE_API_URL=${API_URL}
      - VITE_SOCKET_URL=${SOCKET_URL}
    ports:
      - "3000:80"
```

#### Manual Deployment
1. **Deploy API server** to your preferred hosting (Heroku, AWS, DigitalOcean)
2. **Deploy Socket.IO server** (can be same or separate instance)
3. **Build and deploy frontend** to CDN or static hosting (Vercel, Netlify)
4. **Configure environment variables** for production
5. **Set up domain and SSL** certificates

### Environment Configuration

**Production Environment Variables:**
```env
# API Production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/realestate
JWT_SECRET_KEY=your-production-jwt-secret
CLIENT_URL=https://yourdomain.com

# Frontend Production
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://socket.yourdomain.com

# Socket Production
CLIENT_URL=https://yourdomain.com
PORT=4000
```

## 🎯 Use Cases

### For Property Buyers
- **Search and filter** properties by various criteria
- **View detailed** property information and images
- **Save favorite** properties for later viewing
- **Contact property** owners or agents directly
- **Get real-time updates** on property availability

### For Property Sellers/Agents
- **List properties** with comprehensive details
- **Manage multiple** property listings
- **Communicate directly** with potential buyers
- **Track property** views and engagement
- **Update property** information and pricing

### For Platform Administrators
- **Monitor user** activity and engagement
- **Manage property** listings and quality
- **Handle user** support and moderation
- **Analyze platform** performance and usage

## 🔧 Technical Requirements

### Minimum System Requirements
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 10GB available space
- **Network**: Stable internet connection

### Supported Browsers
- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version
- **Edge**: Latest version
- **Mobile browsers**: iOS Safari, Chrome Mobile

## 📚 Documentation

### Component Documentation
- [API Documentation](./api/README.md) - Backend REST API
- [Client Documentation](./client/README.md) - React frontend
- [Socket.IO Documentation](./socket/README.md) - Real-time server
- [Security Measures](./SECURITY_MEASURES.md) - Security implementation

### Additional Resources
- **API Endpoints**: Detailed in API README
- **Component Guide**: Available in Client README
- **Socket Events**: Documented in Socket README
- **Security Guidelines**: Comprehensive security documentation

## 🛠️ Development Guidelines

### Code Quality Standards
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety where applicable
- **Testing**: Comprehensive test coverage
- **Documentation**: Keep README files updated

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature-name
git add .
git commit -m "feat: add new feature description"
git push origin feature/new-feature-name

# Create pull request for review
```

### Commit Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or updates
- `chore:` - Build/config changes

## 🔍 API Overview

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Property Endpoints
- `GET /api/posts` - Get properties with filters
- `POST /api/posts` - Create new property
- `GET /api/posts/:id` - Get single property
- `PUT /api/posts/:id` - Update property
- `DELETE /api/posts/:id` - Delete property

### User Endpoints
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/save` - Save/unsave property

### Chat Endpoints
- `GET /api/chats` - Get user chats
- `POST /api/chats` - Create new chat
- `POST /api/messages/:chatId` - Add message

## 🎨 UI/UX Features

### Design Principles
- **Mobile-first**: Designed primarily for mobile devices
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast loading and smooth interactions
- **User-centered**: Intuitive and easy-to-use interface

### Visual Elements
- **Consistent branding**: Cohesive color scheme and typography
- **Responsive layouts**: Adapts to all screen sizes
- **Loading states**: Clear feedback for user actions
- **Error handling**: Friendly error messages and recovery options

## 📈 Performance Metrics

### Frontend Performance
- **First Contentful Paint**: < 2 seconds
- **Largest Contentful Paint**: < 3 seconds
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Backend Performance
- **API response time**: < 200ms average
- **Database query time**: < 100ms average
- **Memory usage**: < 512MB per instance
- **CPU usage**: < 70% under normal load

## 🔧 Configuration

### API Configuration
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **File uploads**: Cloudinary integration
- **Error handling**: Centralized error middleware

### Frontend Configuration
- **Routing**: React Router with data loaders
- **State management**: Context API and Zustand
- **Styling**: SCSS with responsive breakpoints
- **Build optimization**: Vite with code splitting

### Socket Configuration
- **Real-time messaging**: Socket.IO with room management
- **Connection handling**: Automatic reconnection
- **Event validation**: Input sanitization and validation
- **Scaling**: Redis adapter support for clustering

## 🚀 Production Considerations

### Scaling Strategies
- **Horizontal scaling**: Multiple API server instances
- **Database optimization**: Proper indexing and query optimization
- **CDN integration**: Static asset delivery optimization
- **Caching layers**: Redis for session and data caching

### Monitoring & Analytics
- **Application monitoring**: Error tracking and performance metrics
- **User analytics**: Usage patterns and feature adoption
- **Security monitoring**: Attack detection and prevention
- **Performance monitoring**: Response times and resource usage

## 🤝 Contributing

### Getting Started
1. **Fork the repository** and clone your fork
2. **Set up development environment** following the quick start guide
3. **Create a feature branch** for your changes
4. **Follow coding standards** and write tests
5. **Submit a pull request** with detailed description

### Development Process
1. **Issue tracking**: Create or assign issues for features/bugs
2. **Code review**: All changes require peer review
3. **Testing**: Ensure tests pass before merging
4. **Documentation**: Update relevant documentation

### Areas for Contribution
- **Feature development**: New functionality and enhancements
- **Bug fixes**: Issue resolution and stability improvements
- **Performance optimization**: Speed and efficiency improvements
- **Documentation**: Improve and expand documentation
- **Testing**: Add test coverage and automation
- **Security**: Enhance security measures and practices

## 📋 Roadmap

### Short-term Goals (Next 3 months)
- [ ] **Enhanced search**: Advanced filtering and sorting options
- [ ] **Mobile app**: React Native or PWA implementation
- [ ] **Payment integration**: Secure payment processing
- [ ] **Analytics dashboard**: User and property analytics

### Medium-term Goals (Next 6 months)
- [ ] **AI recommendations**: Property recommendation engine
- [ ] **Virtual tours**: 360° property viewing
- [ ] **Multi-language support**: Internationalization
- [ ] **Advanced chat features**: File sharing, voice messages

### Long-term Goals (Next year)
- [ ] **Machine learning**: Price prediction and market analysis
- [ ] **IoT integration**: Smart home device connectivity
- [ ] **Blockchain**: Property ownership and transaction records
- [ ] **AR/VR features**: Augmented reality property visualization

## 🐛 Known Issues

### Current Limitations
- **Image upload**: Limited to specific file types and sizes
- **Search performance**: May be slow with large datasets
- **Mobile optimization**: Some features need refinement
- **Chat history**: Limited message history retention

### Planned Fixes
- **Performance optimization**: Database query improvements
- **Mobile enhancements**: Better touch interactions
- **Search improvements**: Elasticsearch integration
- **Chat enhancements**: Message pagination and search

## 📞 Support & Community

### Getting Help
- **Documentation**: Check component-specific README files
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Join community discussions for questions
- **Wiki**: Access the project wiki for detailed guides

### Community Guidelines
- **Be respectful**: Treat all community members with respect
- **Be helpful**: Assist others when possible
- **Be constructive**: Provide actionable feedback
- **Follow standards**: Adhere to coding and contribution guidelines

## 📊 Analytics & Metrics

### User Metrics
- **Daily active users**: Track platform engagement
- **Property views**: Monitor listing popularity
- **Search patterns**: Analyze user search behavior
- **Conversion rates**: Track user actions and outcomes

### Performance Metrics
- **Page load times**: Monitor frontend performance
- **API response times**: Track backend efficiency
- **Error rates**: Monitor application stability
- **Resource usage**: Track server resource consumption

## 🎓 Learning Resources

### Technology Documentation
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

### Tutorials & Guides
- **React Hooks**: Modern React development patterns
- **REST API Design**: Best practices for API development
- **Socket.IO Integration**: Real-time web application development
- **Database Design**: NoSQL schema design principles

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

**Built with ❤️ for the real estate community**

For questions, suggestions, or contributions, please open an issue or submit a pull request.
