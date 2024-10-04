import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new chat message
export const createChatMessage = async (req: Request, res: Response) => {
  const { message, senderId, recipientId } = req.body;
  try {
    const chat = await prisma.chat.create({
      data: {
        message,
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
      },
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat message' });
  }
};

// Get chat messages between two users
export const getChatMessages = async (req: Request, res: Response) => {
  const { senderId, recipientId } = req.params;
  try {
    const messages = await prisma.chat.findMany({
      where: {
        senderId: parseInt(senderId),
        recipientId: parseInt(recipientId),
      },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
};
