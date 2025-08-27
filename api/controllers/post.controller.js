import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  console.log("\n=== Search Debug Info ===");
  console.log("1. Search query received:", query);

  try {
    const where = {};

    if (query.city) {
      where.OR = [
        { city: { contains: query.city, mode: 'insensitive' } },
        { city: { contains: query.city === 'bangalore' ? 'bengaluru' : (query.city === 'bengaluru' ? 'bangalore' : ''), mode: 'insensitive' } }
      ];
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.property) {
      where.property = query.property;
    }

    if (query.bedroom) {
      where.bedroom = parseInt(query.bedroom);
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = parseInt(query.minPrice);
      if (query.maxPrice) where.price.lte = parseInt(query.maxPrice);
    }

    const posts = await prisma.post.findMany({ where });
    
    console.log("5. Search results count:", posts.length);
    if (posts.length > 0) {
      console.log("6. First matching post:", JSON.stringify(posts[0], null, 2));
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in getPosts:", err);
    res.status(500).json({
      message: "Failed to get posts",
      error: err.message
    });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        savedPosts: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;
    let userId = null;
    let isSaved = false;

    if (token) {
      try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        userId = userInfo.id;
        
        // Check if post is saved by current user
        const savedPost = await prisma.savedPost.findFirst({
          where: {
            postId: id,
            userId: userId,
          },
        });
        
        isSaved = !!savedPost;
      } catch (err) {
        console.log("Invalid token");
      }
    }

    // Remove savedPosts array from response
    const { savedPosts, ...postData } = post;

    res.status(200).json({
      ...postData,
      isOwner: userId === post.userId,
      isSaved: isSaved,
    });
  } catch (err) {
    console.error("Error in getPost:", err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  
  try {
    console.log("Creating post with userId:", req.userId);
    
    // Create post with connect instead of just setting userId
    const newPost = await prisma.post.create({
      data: {
        ...postData,
        user: {
          connect: {
            id: req.userId
          }
        },
        postDetail: {
          create: postDetail
        }
      },
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    console.log("Created post:", newPost);
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error in addPost:", err);
    console.error("Full error details:", {
      error: err,
      userId: req.userId,
      token: req.cookies.token
    });
    res.status(500).json({ 
      message: "Failed to create post", 
      error: err.message
    });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  
  try {
    // First check if the post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    // Prepare the update data
    const updateData = {
      ...updates,
      price: updates.price ? parseInt(updates.price) : undefined,
      bedroom: updates.bedroom ? parseInt(updates.bedroom) : undefined,
      bathroom: updates.bathroom ? parseInt(updates.bathroom) : undefined,
    };

    // If there's a description update, handle the postDetail update
    if (updates.desc) {
      updateData.postDetail = {
        update: {
          desc: updates.desc
        }
      };
      delete updateData.desc;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error in updatePost:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  
  try {
    // First check if the post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Delete the post and its details
    await prisma.postDetail.delete({
      where: { id }
    });

    await prisma.post.delete({
      where: { id }
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error in deletePost:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
