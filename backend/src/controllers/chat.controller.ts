import { Request, Response } from 'express';
import { ChatMessage } from '../models/Chat';

export const getChatHistory = async (req: any, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await ChatMessage.find({ chatId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
