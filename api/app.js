import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import geocodeRoute from "./routes/geocode.route.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL, // This is correct for production
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/geocode", geocodeRoute);

// Use the port provided by the environment, or default to 8800
const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});