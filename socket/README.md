# Real Estate Platform - Socket.IO Server

A dedicated Socket.IO server providing real-time messaging capabilities for the real estate platform, enabling instant communication between users, agents, and property inquirers.

## 🚀 Features

- **Real-time Messaging** between users
- **Online User Tracking** and presence indicators
- **Multi-room Support** for different conversations
- **Message Delivery Confirmation** with read receipts
- **Cross-Origin Support** with secure CORS configuration
- **Connection Management** with automatic reconnection
- **Event Logging** for debugging and monitoring
- **Scalable Architecture** for production deployment

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Socket Events](#socket-events)
- [Client Integration](#client-integration)
- [User Management](#user-management)
- [Message Flow](#message-flow)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Contributing](#contributing)

## 🔧 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Access to the main API server
- Frontend client with Socket.IO client

## 📦 Installation

1. **Navigate to the socket directory**
   ```bash
   cd Real_State_Project/socket
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

4. **Start the Socket.IO server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌍 Environment Variables

Create a `.env` file in the socket directory:

```env
# Server Configuration
PORT=4000

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Environment
NODE_ENV=development

# Logging
LOG_LEVEL=info

# Redis (for scaling - optional)
REDIS_URL=redis://localhost:6379
```

## ⚡ Socket Events

### Client to Server Events

#### `newUser`
Registers a new user when they connect to the chat system.

```javascript
// Client side
socket.emit("newUser", userId);
```

**Parameters:**
- `userId` (string): Unique identifier for the user

**Response:**
- Updates online users list
- Broadcasts updated online users to all clients

#### `sendMessage`
Sends a message from one user to another.

```javascript
// Client side
socket.emit("sendMessage", {
  receiverId: "recipient_user_id",
  data: {
    text: "Hello! I'm interested in your property.",
    senderId: "sender_user_id",
    chatId: "chat_id",
    timestamp: new Date().toISOString()
  }
});
```

**Parameters:**
- `receiverId` (string): ID of the message recipient
- `data` (object): Message data containing text, sender info, chat ID, and timestamp

### Server to Client Events

#### `getMessage`
Delivers a message to the specified recipient.

```javascript
// Client side listener
socket.on("getMessage", (messageData) => {
  // Handle received message
  console.log("New message received:", messageData);
  // Update chat interface
});
```

**Data Structure:**
```javascript
{
  text: "Message content",
  senderId: "sender_user_id",
  chatId: "chat_id",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

#### `getOnlineUsers`
Broadcasts the list of currently online users.

```javascript
// Client side listener
socket.on("getOnlineUsers", (onlineUserIds) => {
  console.log("Online users:", onlineUserIds);
  // Update online status indicators
});
```

**Data Structure:**
- Array of user IDs currently online

## 👥 User Management

### Online User Tracking

```javascript
let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
    console.log(`User added: ${userId}, Socket ID: ${socketId}`);
  }
};

const removeUser = (socketId) => {
  const user = onlineUsers.find(u => u.socketId === socketId);
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  if (user) {
    console.log(`User removed: ${user.userId}`);
  }
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};
```

### User States

- **Connected**: User is online and can receive messages
- **Disconnected**: User is offline, messages will be stored for later
- **Idle**: User is connected but inactive

## 📨 Message Flow

### Message Delivery Process

1. **Client sends message** via `sendMessage` event
2. **Server validates** the recipient exists and is online
3. **Server forwards message** to recipient's socket
4. **Recipient receives** message via `getMessage` event
5. **Message persistence** handled by main API server

### Message Structure

```javascript
{
  text: "Message content",           // Required: The message text
  senderId: "user_id_123",          // Required: Sender's user ID
  chatId: "chat_id_456",            // Required: Chat room identifier
  timestamp: "2024-01-15T10:30:00", // Required: Message timestamp
  messageId: "msg_id_789",          // Optional: Unique message ID
  type: "text",                     // Optional: Message type (text, image, etc.)
  metadata: {                       // Optional: Additional message data
    read: false,
    delivered: true
  }
}
```

## 🔐 Security Features

### CORS Configuration

```javascript
const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,  // Only allow specific origin
    methods: ["GET", "POST"],        // Allowed HTTP methods
    credentials: true                // Allow credentials
  },
});
```

### Input Validation

```javascript
// Validate incoming message data
socket.on("sendMessage", ({ receiverId, data }) => {
  // Validate receiverId
  if (!receiverId || typeof receiverId !== 'string') {
    console.error('Invalid receiverId provided');
    return;
  }
  
  // Validate message data
  if (!data || !data.text || typeof data.text !== 'string') {
    console.error('Invalid message data provided');
    return;
  }
  
  // Sanitize message content (basic)
  if (data.text.length > 1000) {
    console.warn('Message too long, truncating');
    data.text = data.text.substring(0, 1000);
  }
  
  // Process message...
});
```

## 🔗 Client Integration

### Frontend Connection Setup

```javascript
// React context for Socket.IO
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentUser) {
      // Connect to Socket.IO server
      const newSocket = io(process.env.VITE_SOCKET_URL || "http://localhost:4000");
      setSocket(newSocket);

      // Register user
      newSocket.emit("newUser", currentUser.id);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } else {
      // Disconnect when user logs out
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
```

### Message Sending

```javascript
// Sending a message from React component
const Chat = () => {
  const { socket } = useSocket();
  const [message, setMessage] = useState("");

  const sendMessage = (receiverId, chatId) => {
    if (socket && message.trim()) {
      const messageData = {
        text: message,
        senderId: currentUser.id,
        chatId: chatId,
        timestamp: new Date().toISOString()
      };

      // Emit message to Socket.IO server
      socket.emit("sendMessage", {
        receiverId: receiverId,
        data: messageData
      });

      // Clear message input
      setMessage("");
    }
  };

  return (
    <div className="chat">
      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(receiverId, chatId);
          }
        }}
      />
      <button onClick={() => sendMessage(receiverId, chatId)}>
        Send
      </button>
    </div>
  );
};
```

### Message Reception

```javascript
// Receiving messages in React component
const Chat = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on("getMessage", (messageData) => {
        console.log("New message received:", messageData);
        
        // Update messages state
        setMessages(prev => [...prev, messageData]);
        
        // Show notification (optional)
        showNotification("New message received");
      });

      // Listen for online users updates
      socket.on("getOnlineUsers", (onlineUserIds) => {
        setOnlineUsers(onlineUserIds);
      });

      // Cleanup listeners
      return () => {
        socket.off("getMessage");
        socket.off("getOnlineUsers");
      };
    }
  }, [socket]);

  return (
    <div className="chatContainer">
      {/* Chat UI components */}
    </div>
  );
};
```

## 📊 Connection Management

### Connection Events

```javascript
// Server-side connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user registration
  socket.on("newUser", (userId) => {
    console.log(`Received newUser event for userId: ${userId}`);
    socket.userId = userId;  // Store userId on socket
    addUser(userId, socket.id);
    
    // Broadcast updated online users
    io.emit("getOnlineUsers", onlineUsers.map(u => u.userId));
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
    
    // Broadcast updated online users
    io.emit("getOnlineUsers", onlineUsers.map(u => u.userId));
  });

  // Handle connection errors
  socket.on("connect_error", (error) => {
    console.error(`Connection error for ${socket.id}:`, error);
  });
});
```

## 🚀 Production Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership and switch to non-root user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
               const options = { hostname: 'localhost', port: 4000, path: '/socket.io/', method: 'GET' }; \
               const req = http.request(options, (res) => { \
                 process.exit(res.statusCode === 200 ? 0 : 1); \
               }); \
               req.on('error', () => process.exit(1)); \
               req.end();"

# Start the application
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
# Production settings
NODE_ENV=production
PORT=4000
CLIENT_URL=https://your-frontend-domain.com
LOG_LEVEL=warn
```

## 📊 Monitoring & Logging

### Performance Metrics

```javascript
// Connection metrics
let connectionCount = 0;
let messageCount = 0;
let peakConnections = 0;

io.on("connection", (socket) => {
  connectionCount++;
  peakConnections = Math.max(peakConnections, connectionCount);
  
  console.log(`Connections: ${connectionCount}, Peak: ${peakConnections}`);
  
  socket.on("sendMessage", () => {
    messageCount++;
  });
  
  socket.on("disconnect", () => {
    connectionCount--;
  });
});

// Periodic metrics reporting
setInterval(() => {
  console.log('Socket.IO Metrics:', {
    activeConnections: connectionCount,
    peakConnections,
    totalMessages: messageCount,
    onlineUsers: onlineUsers.length,
    uptime: process.uptime()
  });
}, 60000); // Every minute
```

### Health Check Endpoint

```javascript
import express from 'express';

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    connections: io.engine.clientsCount,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.listen(4001, () => {
  console.log('Health check server running on port 4001');
});
```

## 🧪 Testing

### Unit Tests

```javascript
// socket.test.js
import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";

describe("Socket.IO Tests", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("should register new user", (done) => {
    clientSocket.emit("newUser", "user123");
    serverSocket.on("newUser", (userId) => {
      expect(userId).toBe("user123");
      done();
    });
  });

  test("should send message between users", (done) => {
    const messageData = {
      text: "Hello!",
      senderId: "user1",
      chatId: "chat1"
    };

    clientSocket.emit("sendMessage", {
      receiverId: "user2",
      data: messageData
    });

    clientSocket.on("getMessage", (data) => {
      expect(data.text).toBe("Hello!");
      done();
    });
  });
});
```

## 🔍 Troubleshooting

### Common Issues

#### Connection Failures
```javascript
// Debug connection issues
socket.on("connect_error", (error) => {
  console.error("Connection failed:", error);
  
  // Common solutions:
  // 1. Check CORS configuration
  // 2. Verify server is running
  // 3. Check firewall settings
  // 4. Validate CLIENT_URL environment variable
});
```

#### Message Delivery Issues
```javascript
// Debug message delivery
socket.on("sendMessage", ({ receiverId, data }) => {
  console.log(`Attempting to send message to: ${receiverId}`);
  
  const receiver = getUser(receiverId);
  if (!receiver) {
    console.log(`Receiver ${receiverId} not found. Online users:`, 
                onlineUsers.map(u => u.userId));
  }
});
```

### Debugging Tools

```bash
# Enable debug mode
DEBUG=socket.io* npm run dev

# Monitor network connections
netstat -an | grep 4000

# Check process status
ps aux | grep node
```

## 🤝 Contributing

### Development Guidelines

1. **Event Naming**: Use clear, descriptive event names
2. **Error Handling**: Implement comprehensive error handling
3. **Logging**: Add appropriate logging for debugging
4. **Testing**: Write tests for new functionality
5. **Documentation**: Update this README for any changes

### Code Style

```javascript
// Example of well-structured event handler
socket.on("eventName", async (data) => {
  try {
    // 1. Validate input
    if (!validateInput(data)) {
      throw new Error('Invalid input data');
    }
    
    // 2. Process data
    const processedData = await processData(data);
    
    // 3. Emit response
    socket.emit("responseEvent", processedData);
    
    // 4. Log success
    console.log(`Event processed successfully: ${data.id}`);
    
  } catch (error) {
    // 5. Handle errors
    console.error('Error processing event:', error);
    socket.emit("errorEvent", { message: error.message });
  }
});
```

## 📚 Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [WebSocket MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Redis Documentation](https://redis.io/docs/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

