import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

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
        return { ...chat, receiver };
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
    const chat = await prisma.chat.findUnique({
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

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
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
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }


    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
      },
    });
    
    res.status(201).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
