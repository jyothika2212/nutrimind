import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRouter from './routes';
import Chat, { ChatMessage } from './models/Chat';
import { AIService } from './services/ai.service';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io initialization with CORS parameters
const io = new Server(server, {
  cors: {
    origin: '*', // For development, allow all. In production, restrict.
    methods: ['GET', 'POST']
  }
});

// Configure Helmet security headers
app.use(helmet());

// Configure CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter: 100 requests per 15 minutes max per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: { error: 'Too many requests from this IP, please try again in 15 minutes' }
});
app.use('/api/', limiter);

// Bind main API router
app.use('/api', apiRouter);

// Basic landing endpoint
app.get('/', (req, res) => {
  res.send('NutriMind AI Enterprise Backend Server Running Successfully!');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Socket.IO Room Listeners for messaging
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Join a private chat room
  socket.on('join_room', ({ chatId }) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room: ${chatId}`);
  });

  // Sending message
  socket.on('send_message', async ({ chatId, senderId, recipientId, messageText, image }) => {
    try {
      // 1. Save to MongoDB
      const newMessage = new ChatMessage({
        chatId,
        senderId,
        recipientId,
        messageText,
        image,
        isRead: false
      });
      await newMessage.save();

      // 2. Broadcast message inside room
      io.to(chatId).emit('receive_message', newMessage);
      console.log(`Message broadcasted inside room: ${chatId}`);

      // 3. Auto-answer if recipient is AI Doctor
      const AI_DOCTOR_ID = '414920446f63746f72204944';
      if (recipientId === AI_DOCTOR_ID) {
        // Fetch last 10 messages from MongoDB for chat history to give context to Gemini
        const historyMessages = await ChatMessage.find({ chatId })
          .sort({ createdAt: -1 })
          .limit(10);
        
        // Reverse history to chronological order
        const sortedHistory = historyMessages.reverse();

        const chatHistory = sortedHistory.map(msg => ({
          role: msg.senderId.toString() === AI_DOCTOR_ID ? 'model' as const : 'user' as const,
          parts: msg.messageText
        }));

        // Call Gemini
        const aiResponseText = await AIService.chatReply(chatHistory, messageText);

        // Save AI response to MongoDB
        const aiMessage = new ChatMessage({
          chatId,
          senderId: AI_DOCTOR_ID,
          recipientId: senderId,
          messageText: aiResponseText,
          isRead: false
        });
        await aiMessage.save();

        // Emit AI response inside room
        io.to(chatId).emit('receive_message', aiMessage);
        console.log(`AI Doctor response emitted inside room: ${chatId}`);
      }
    } catch (err) {
      console.error('Error saving socket message:', (err as Error).message);
    }
  });

  // Typing state indicators
  socket.on('typing', ({ chatId, userId, isTyping }) => {
    socket.to(chatId).emit('user_typing', { userId, isTyping });
  });

  // Message read status
  socket.on('mark_read', async ({ chatId, userId }) => {
    try {
      await ChatMessage.updateMany(
        { chatId, recipientId: userId, isRead: false },
        { $set: { isRead: true } }
      );
      socket.to(chatId).emit('messages_read', { userId });
    } catch (err) {
      console.error('Error marking messages as read:', (err as Error).message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5010;

// Connect to Database and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n\x1b[36m========================================================\x1b[0m`);
    console.log(`\x1b[36m  NutriMind AI Server running on http://localhost:${PORT}  \x1b[0m`);
    console.log(`\x1b[36m========================================================\x1b[0m\n`);
  });
});
