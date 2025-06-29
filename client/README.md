# 🏠 Real Estate Platform - Frontend

This is the React frontend application for the Real Estate Platform. Built with modern React technologies and designed for optimal user experience.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd client
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 🛠️ Tech Stack

- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **SCSS** - Advanced CSS styling with variables and mixins
- **Leaflet** - Interactive maps for property visualization
- **React Quill** - Rich text editor for property descriptions
- **Axios** - HTTP client for API communication
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time messaging capabilities

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── card/           # Property card components
│   ├── chat/           # Chat and messaging components
│   ├── filter/         # Search and filter components
│   ├── list/           # Property listing components
│   ├── map/            # Interactive map components
│   ├── navbar/         # Navigation components
│   ├── pin/            # Map pin components
│   ├── searchBar/      # Search functionality
│   ├── slider/         # Image slider components
│   └── uploadWidget/   # Image upload components
├── context/            # React context providers
│   ├── AuthContext.jsx # Authentication state management
│   └── SocketContext.jsx # Socket.io connection management
├── lib/                # Utility functions and helpers
│   ├── apiRequest.js   # API communication utilities
│   ├── dummydata.js    # Sample data for development
│   ├── loaders.js      # Data loading functions
│   └── notificationStore.js # Notification state management
├── routes/             # Page components and routing
│   ├── homePage/       # Landing page
│   ├── layout/         # Main layout wrapper
│   ├── listPage/       # Property listing page
│   ├── login/          # Authentication pages
│   ├── newPostPage/    # Create new property listing
│   ├── profilePage/    # User profile management
│   ├── register/       # User registration
│   └── singlePage/     # Individual property page
└── main.jsx           # Application entry point
```

## 🎨 Key Features

### Responsive Design
- Mobile-first approach
- Responsive breakpoints for all screen sizes
- Touch-friendly interface

### Interactive Maps
- Leaflet integration for property visualization
- Custom map markers and popups
- Location-based search functionality

### Real-time Features
- Live chat with Socket.io
- Real-time notifications
- Online user status

### Modern UI/UX
- Clean and intuitive design
- Smooth animations and transitions
- Loading states and error handling

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:8800
VITE_SOCKET_URL=http://localhost:4000
```

### API Integration
The frontend communicates with the backend API through:
- RESTful endpoints for CRUD operations
- WebSocket connection for real-time features
- JWT authentication for secure requests

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Component Architecture

### State Management
- **Zustand** for global state management
- **React Context** for authentication and socket connections
- **Local state** for component-specific data

### Routing
- **React Router DOM** for client-side routing
- **Protected routes** for authenticated users
- **Data loading** with route loaders

### Styling
- **SCSS** for advanced CSS features
- **Modular styling** with component-specific files
- **Responsive design** with mobile-first approach

## 🚀 Performance Optimizations

- **Code splitting** with React Router
- **Lazy loading** for components
- **Image optimization** with Cloudinary
- **Bundle optimization** with Vite

## 🔒 Security Features

- **JWT token management**
- **Protected routes**
- **Input sanitization**
- **XSS prevention**

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Follow the existing code style
2. Add appropriate comments and documentation
3. Test your changes thoroughly
4. Update this README if needed

## 📝 License

This project is licensed under the ISC License.