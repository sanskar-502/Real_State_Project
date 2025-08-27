import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const checkSavedPost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findFirst({
      where: {
        userId,
        postId,
      },
    });
    
    res.status(200).json({ isSaved: !!savedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to check saved status!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    // First check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if post is already saved
    const savedPost = await prisma.savedPost.findFirst({
      where: {
        AND: [
          { userId: tokenUserId },
          { postId: postId }
        ]
      }
    });

    if (savedPost) {
      // Post is already saved, so unsave it
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id
        }
      });

      return res.status(200).json({ 
        message: "Post removed from saved list",
        isSaved: false
      });
    }

    // Save the post
    await prisma.savedPost.create({
      data: {
        userId: tokenUserId,
        postId: postId
      }
    });

    return res.status(200).json({ 
      message: "Post saved successfully",
      isSaved: true
    });

  } catch (err) {
    console.error("Error in savePost:", err);
    res.status(500).json({ message: "Failed to save/unsave post!" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Get user's posts and saved posts in parallel
    const [userPosts, savedPostsData] = await Promise.all([
      prisma.post.findMany({
        where: { userId: tokenUserId },
        include: {
          user: {
            select: {
              username: true,
              avatar: true
            }
          },
          postDetail: true
        }
      }),
      prisma.savedPost.findMany({
        where: { userId: tokenUserId },
        include: {
          post: {
            include: {
              user: {
                select: {
                  username: true,
                  avatar: true
                }
              },
              postDetail: true
            }
          }
        }
      })
    ]);

    // Extract and expand posts from savedPosts data
    const savedPosts = savedPostsData
      .filter(item => item.post !== null)
      .map(item => ({
        id: item.post.id,
        title: item.post.title,
        price: item.post.price,
        images: item.post.images,
        address: item.post.address,
        city: item.post.city,
        bedroom: item.post.bedroom,
        bathroom: item.post.bathroom,
        latitude: item.post.latitude,
        longitude: item.post.longitude,
        type: item.post.type,
        property: item.post.property,
        createdAt: item.post.createdAt,
        userId: item.post.userId,
        user: item.post.user,
        postDetail: item.post.postDetail
      }));

    // Get user's posts with full details
    const userPostsWithDetails = await Promise.all(
      userPosts.map(async (post) => {
        const postDetail = await prisma.postDetail.findUnique({
          where: { postId: post.id }
        });
        return {
          ...post,
          postDetail
        };
      })
    );

    console.log('Profile data:', {
      userPostsCount: userPostsWithDetails.length,
      savedPostsCount: savedPosts.length,
      userPosts: JSON.stringify(userPostsWithDetails, null, 2),
      savedPosts: JSON.stringify(savedPosts, null, 2)
    });

    res.status(200).json({
      data: {
        userPosts: userPostsWithDetails,
        savedPosts: savedPosts
      }
    });
  } catch (err) {
    console.error("Error in profilePosts:", err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};
