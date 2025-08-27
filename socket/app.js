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
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    // Broadcast the updated list of online users to all clients
    io.emit("getOnlineUsers", onlineUsers.map(u => u.userId));
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      // Send message directly to the specific receiver's socket
      io.to(receiver.socketId).emit("getMessage", data);
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