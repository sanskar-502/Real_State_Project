import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId; // Using userId from middleware

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    const chatsWithReceivers = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
        if (!receiverId) return { ...chat, receiver: null };

        const [receiver, unreadCount] = await Promise.all([
          prisma.user.findUnique({
            where: {
              id: receiverId,
            },
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          }),
          prisma.message.count({
            where: {
              chatId: chat.id,
              senderId: receiverId,
              NOT: {
                seenBy: {
                  hasSome: [tokenUserId],
                },
              },
            },
          }),
        ]);

        return { 
          ...chat, 
          receiver,
          unreadCount 
        };
      })
    );

    res.status(200).json(chatsWithReceivers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Mark messages as seen (only ones not already seen by this user)
    await prisma.message.updateMany({
      where: {
        chatId: chat.id,
        NOT: {
          senderId: tokenUserId,
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    // Mark chat as seen (only if not already seen)
    if (!chat.seenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          seenBy: {
            push: tokenUserId,
          },
        },
      });
    }

    // Get receiver information
    const receiverId = chat.userIDs.find(id => id !== tokenUserId);
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    res.status(200).json({
      ...chat,
      receiver
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required" });
  }

  try {
    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
    });

    if (existingChat) {
      return res.status(200).json({
        ...existingChat,
        receiver
      });
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        seenBy: [tokenUserId], // Mark as seen by creator
      },
    });
    
    res.status(201).json({
      ...newChat,
      receiver
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // First, get the current chat to check existing seenBy arrays
    const currentChat = await prisma.chat.findFirst({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!currentChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Only update messages that aren't already seen by this user
    await prisma.message.updateMany({
      where: {
        chatId: req.params.id,
        NOT: {
          senderId: tokenUserId,
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    // Only update chat if user hasn't already seen it
    if (!currentChat.seenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: {
          id: req.params.id,
        },
        data: {
          seenBy: {
            push: tokenUserId,
          },
        },
      });
    }

    // Get updated chat data
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Get receiver information
    const receiverId = chat.userIDs.find(id => id !== tokenUserId);
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    res.status(200).json({
      ...chat,
      receiver
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
