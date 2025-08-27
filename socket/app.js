// Corrected and Production-Ready socket/app.js

import { Server } from "socket.io";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

const PORT = process.env.PORT || 4000;

const io = new Server({
  cors: {
    // Use the environment variable for the client URL.
    // This is the CRITICAL change for deployment.
    origin: process.env.CLIENT_URL,
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
    console.log(`User added: ${userId}, Socket ID: ${socketId}. Current online users: ${onlineUsers.length}`);
  } else {
    console.log(`User ${userId} already online.`);
  }
};

const removeUser = (socketId) => {
  const user = onlineUsers.find(u => u.socketId === socketId);
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  if (user) {
    console.log(`User removed: ${user.userId}, Socket ID: ${socketId}. Current online users: ${onlineUsers.length}`);
  }
};

const getUser = (userId) => {
  const user = onlineUsers.find((user) => user.userId === userId);
  console.log(`Attempting to get user: ${userId}. Found: ${user ? 'Yes' : 'No'}`);
  return user;
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("newUser", (userId) => {
    console.log(`Received newUser event for userId: ${userId}`);
    addUser(userId, socket.id);
    // Broadcast the updated list of online users to all clients
    io.emit("getOnlineUsers", onlineUsers.map(u => u.userId));
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    console.log(`Received sendMessage event. Receiver ID: ${receiverId}`);
    const receiver = getUser(receiverId);
    if (receiver) {
      console.log(`Receiver ${receiverId} found. Sending message.`);
      // Send message directly to the specific receiver's socket
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.log(`Receiver ${receiverId} not found. Message not sent.`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
    // Broadcast the updated list of online users to all clients
    io.emit("getOnlineUsers", onlineUsers.map(u => u.userId));
  });
});

io.listen(PORT, () => {
    console.log(`Socket.IO server is listening on port ${PORT}`);
});
