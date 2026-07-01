import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  senderId: mongoose.Types.ObjectId;
  messageText: string;
  image?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[]; // User and Dietitian
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageText: { type: String, required: true },
  image: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ChatSchema: Schema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]
  },
  { timestamps: true }
);

// We can store messages in a separate message collection, or embed them if the chats are small.
// For robust large scale production, messages are in a separate collection. Let's create a separate Message model or sub-document schema.
// A separate message collection is cleaner for pagination!
// Let's create Message model.

const ChatMessageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messageText: { type: String, required: true },
    image: { type: String },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
export default mongoose.model<IChat>('Chat', ChatSchema);
