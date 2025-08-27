# 🏠 Real Estate Platform - Socket.io Server

This is the Socket.io server for the Real Estate Platform that handles real-time messaging and communication features.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Socket.io client (frontend)

### Installation
```bash
cd socket
npm install
```

### Development
```bash
npm start
```

The Socket.io server will be available at `http://localhost:4000`

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
socket/
├── app.js              # Main Socket.io server file
├── package.json        # Dependencies and scripts
└── package-lock.json   # Locked dependency versions
```

## 🔧 Socket Events

### Client to Server Events

#### `newUser`
- **Purpose**: Register a new user as online
- **Data**: `userId` (string)
- **Description**: Adds user to the online users list

#### `sendMessage`
- **Purpose**: Send a message to another user
- **Data**: `{ receiverId: string, data: object }`
- **Description**: Forwards message to the specified receiver

#### `disconnect`
- **Purpose**: Handle user disconnection
- **Description**: Removes user from online users list

### Server to Client Events

#### `getMessage`
- **Purpose**: Receive a new message
- **Data**: Message object
- **Description**: Sent to message receiver

## 👥 User Management

### Online Users Tracking
```javascript
let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};
```

### Features
- **Real-time user status**: Track who's online
- **Instant messaging**: Direct message delivery
- **Connection management**: Handle user connections/disconnections
- **Message routing**: Route messages to correct recipients

## 🔒 Security Features

### CORS Configuration
```javascript
const io = new Server({
  cors: {
    origin: "http://localhost:5173", // Frontend URL
  },
});
```

### Connection Validation
- Validate user connections
- Handle unauthorized access
- Secure message delivery

## 📡 Real-time Features

### Instant Messaging
- **Direct messaging**: Send messages to specific users
- **Message delivery**: Real-time message notifications
- **Online status**: See who's currently online

### Chat Functionality
- **Message history**: Retrieve past conversations
- **Read receipts**: Track message read status
- **Typing indicators**: Show when users are typing

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the socket directory:
```env
SOCKET_PORT=4000
CLIENT_URL=http://localhost:5173
```

### CORS Settings
- Configure allowed origins
- Enable credentials
- Set up proper headers

## 🚀 Performance Optimizations

### Connection Management
- Efficient user tracking
- Memory optimization
- Connection pooling

### Message Handling
- Fast message routing
- Minimal latency
- Scalable architecture

## 📊 Monitoring

### Connection Tracking
- Monitor active connections
- Track user sessions
- Log connection events

### Message Statistics
- Message delivery rates
- Connection success rates
- Error tracking

## 🔧 Integration

### Frontend Integration
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

// Connect as a new user
socket.emit("newUser", userId);

// Send a message
socket.emit("sendMessage", {
  receiverId: targetUserId,
  data: messageData
});

// Listen for incoming messages
socket.on("getMessage", (data) => {
  // Handle received message
});
```

### Backend Integration
- Works with the main API server
- Shares user authentication
- Integrates with chat system

## 🧪 Testing

### Manual Testing
1. Start the socket server
2. Connect multiple clients
3. Test message sending/receiving
4. Verify online status tracking

### Testing Tools
- Socket.io client testing
- Browser developer tools
- Network monitoring

## 🚀 Deployment

### Production Setup
1. Configure environment variables
2. Set up proper CORS origins
3. Deploy to hosting platform
4. Update frontend connection URL

### Environment Variables for Production
```env
SOCKET_PORT=4000
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

## 📝 API Reference

### Socket Connection
```javascript
const socket = io("http://localhost:4000", {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});
```

### Event Emitters
```javascript
// Register as online user
socket.emit("newUser", userId);

// Send message
socket.emit("sendMessage", {
  receiverId: "target_user_id",
  data: {
    text: "Hello!",
    senderId: "current_user_id",
    timestamp: new Date()
  }
});
```

### Event Listeners
```javascript
// Listen for new messages
socket.on("getMessage", (data) => {
  console.log("New message received:", data);
});

// Listen for connection status
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});
```

## 🤝 Contributing

1. Follow the existing code style
2. Add proper error handling
3. Test all socket events
4. Update documentation

## 📝 License

This project is licensed under the ISC License. 