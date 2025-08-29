# Real Estate Client Documentation

A modern React frontend application for the real estate platform, built with Vite, featuring responsive design, real-time chat, interactive maps, and comprehensive property search functionality.

## 🚀 Features

- **Modern React Architecture** with functional components and hooks
- **Responsive Design** optimized for mobile and desktop
- **Real-time Chat** integration with Socket.IO
- **Interactive Maps** using Leaflet for property locations
- **Advanced Search & Filtering** with security validations
- **User Authentication** with protected routes
- **Property Management** (view, create, edit, save)
- **Rich Text Editor** for property descriptions
- **Image Gallery** with optimized loading
- **State Management** with Zustand
- **Modern Build Tools** with Vite

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Architecture](#architecture)
- [Components](#components)
- [Routing](#routing)
- [State Management](#state-management)
- [Security Features](#security-features)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)

## 🔧 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Access to the backend API
- Access to the Socket.IO server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanskar-502/Real_State_Project
   cd Real_State_Project/client
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

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8800/api
VITE_SOCKET_URL=http://localhost:4000

# External Services
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_CLOUDINARY_URL=your_cloudinary_url

# Application Settings
VITE_APP_NAME="Real Estate Platform"
VITE_MAX_FILE_SIZE=5242880
```

## 🏢 Architecture

### Technology Stack

- **React 18**: Frontend framework with concurrent features
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API requests
- **Socket.IO Client**: Real-time communication
- **Leaflet**: Interactive maps
- **React Quill**: Rich text editor
- **SCSS**: Styling with CSS preprocessor
- **DOMPurify**: XSS protection for rich content

### Project Structure

```
client/
├── public/                 # Static assets
│   ├── images/            # Property images and icons
│   ├── search.png         # Search icon
│   └── index.html         # HTML template
├── src/
│   ├── components/        # Reusable components
│   │   ├── card/          # Property card component
│   │   ├── chat/          # Chat functionality
│   │   ├── filter/        # Search filters
│   │   ├── list/          # Property list
│   │   ├── map/           # Interactive map
│   │   ├── navbar/        # Navigation bar
│   │   ├── pin/           # Map pins
│   │   ├── searchBar/     # Search functionality
│   │   └── slider/        # Image slider
│   ├── routes/            # Page components
│   │   ├── homePage/      # Landing page
│   │   ├── listPage/      # Property listings
│   │   ├── singlePage/    # Property details
│   │   ├── profilePage/   # User profile
│   │   ├── login/         # Authentication
│   │   ├── register/      # User registration
│   │   └── layout/        # Layout components
│   ├── lib/               # Utility libraries
│   │   ├── apiRequest.js  # API client configuration
│   │   ├── loaders.js     # Route data loaders
│   │   └── notificationStore.js # Notification state
│   ├── context/           # React contexts
│   │   ├── AuthContext.js # Authentication state
│   │   └── SocketContext.js # Socket.IO integration
│   ├── styles/            # Global styles
│   │   └── responsive.scss # Responsive breakpoints
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
└── package.json          # Dependencies and scripts
```

## 🧩 Components

### Core Components

#### Card Component (`/components/card/`)
```jsx
// Property card for listings
<Card item={property} />
```
Features:
- Property image gallery
- Price formatting
- Location display
- Save/unsave functionality
- Responsive design

#### Chat Component (`/components/chat/`)
```jsx
// Real-time chat interface
<Chat chats={userChats} />
```
Features:
- Real-time messaging with Socket.IO
- Message history
- Online user indicators
- Responsive chat interface

#### Filter Component (`/components/filter/`)
```jsx
// Advanced property filtering
<Filter />
```
Features:
- Multiple filter criteria
- Price range validation
- Active filter display
- Security input validation

#### Map Component (`/components/map/`)
```jsx
// Interactive property map
<Map items={properties} />
```
Features:
- Leaflet integration
- Property markers
- Popup information
- Zoom controls

#### SearchBar Component (`/components/searchBar/`)
```jsx
// Main search functionality
<SearchBar query={searchQuery} setQuery={setSearchQuery} />
```
Features:
- Type selection (buy/rent)
- City search
- Price range inputs
- Security validations
- Enter key support

### Page Components

#### HomePage (`/routes/homePage/`)
- Hero section with search
- Featured properties
- Statistics display
- Call-to-action sections

#### ListPage (`/routes/listPage/`)
- Property grid layout
- Filter sidebar
- Map integration
- Pagination support

#### SinglePage (`/routes/singlePage/`)
- Property details view
- Image gallery
- Contact information
- Similar properties

#### ProfilePage (`/routes/profilePage/`)
- User profile management
- User's properties
- Saved properties
- Chat access

## 🗺️ Routing

### Route Configuration

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/agents", element: <AgentPage /> },
      { path: "/list", element: <ListPage />, loader: listPageLoader },
      { path: "/:id", element: <SinglePage />, loader: singlePageLoader },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      { path: "/profile", element: <ProfilePage />, loader: profilePageLoader },
      { path: "/profile/update", element: <ProfileUpdatePage /> },
      { path: "/add", element: <NewPostPage /> },
    ],
  },
]);
```

### Protected Routes

- `/profile` - User profile and dashboard
- `/profile/update` - Profile editing
- `/add` - Create new property listing

## 🎨 Styling

### SCSS Architecture

```
styles/
├── responsive.scss       # Responsive breakpoints and mixins
├── _variables.scss       # Global variables
├── _mixins.scss         # Reusable mixins
└── _base.scss           # Base styles
```

### Responsive Design

```scss
// Mobile-first responsive design
$breakpoints: (
  xs: 480px,   // Extra small devices
  sm: 768px,   // Small devices (tablets)
  md: 992px,   // Medium devices (desktops)
  lg: 1200px,  // Large devices
  xl: 1400px   // Extra large devices
);
```

## 🛡️ Security Features

### Input Validation

```javascript
// Price input validation
const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'minPrice' || name === 'maxPrice') {
    // Length validation
    if (value.length > 12) {
      console.warn('Price input too long, truncating');
      e.target.value = value.substring(0, 12);
      return;
    }
    
    // Character validation
    if (value && !/^\\d*\\.?\\d*$/.test(value)) {
      console.warn('Invalid characters in price');
      return;
    }
    
    // Range validation
    const numValue = parseFloat(value);
    if (numValue < 0 || numValue > 10000000000) {
      console.warn('Price out of range');
      return;
    }
  }
};
```

### XSS Protection

- DOMPurify integration for rich text content
- Input sanitization before API requests
- Secure HTML rendering

## 📈 Performance Optimizations

### Code Splitting

```javascript
// Lazy loading for route components
const ListPage = lazy(() => import('./routes/listPage/listPage'));
const SinglePage = lazy(() => import('./routes/singlePage/singlePage'));
```

### Image Optimization

```jsx
// Optimized image loading
<img 
  src={item.images[0]} 
  alt={item.title}
  loading="lazy"
  onError={(e) => { e.target.src = '/default-property.jpg'; }}
/>
```

## 🔨 Build & Deployment

### Development Build

```bash
# Start development server
npm run dev

# Development server with host access
npm run dev -- --host
```

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Docker Deployment

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🗺️ Map Integration

### Leaflet Configuration

```javascript
// Map component with custom markers
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = ({ items }) => {
  return (
    <MapContainer 
      center={[20.5937, 78.9629]} 
      zoom={6} 
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map(item => (
        <Marker 
          key={item.id} 
          position={[item.latitude, item.longitude]}
        >
          <Popup>
            <div className="popupContainer">
              <img src={item.images[0]} alt="" />
              <div className="textContainer">
                <Link to={`/${item.id}`}>{item.title}</Link>
                <span>{item.bedroom} bedroom</span>
                <b>₹ {item.price}</b>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
```

## 💬 Real-time Chat

### Socket.IO Integration

```javascript
// Socket context setup
const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io("http://localhost:4000");
      setSocket(newSocket);
      
      newSocket.emit("newUser", currentUser.id);
      
      return () => newSocket.close();
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
```

## 🎦 State Management

### Zustand Stores

```javascript
import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    // Fetch notification count from API
  },
  decrease: () => set((prev) => ({ number: prev.number - 1 })),
  reset: () => set({ number: 0 })
}));
```

## 🧪 Testing

### Testing Setup

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment Options

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

### Netlify Deployment

```bash
# Build command
npm run build

# Publish directory
dist
```

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint and Prettier configurations
2. **Component Structure**: Use functional components with hooks
3. **State Management**: Use appropriate state management
4. **Testing**: Write tests for critical functionality
5. **Accessibility**: Ensure WCAG compliance
6. **Performance**: Optimize components and assets

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Leaflet Documentation](https://leafletjs.com/)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
