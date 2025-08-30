import express from "express";
import { updateUser, savePost, profilePosts, getNotificationNumber, checkSavedPost } from "../controllers/user.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/:id", verifyToken, updateUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);
router.get("/isSaved/:postId", verifyToken, checkSavedPost);

export default router;
