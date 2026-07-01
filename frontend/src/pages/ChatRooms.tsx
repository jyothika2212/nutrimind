import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import io from 'socket.io-client';
import { Send, Image, User, Check, CheckCheck } from 'lucide-react';
import { BACKEND_URL } from '../services/api';

export const ChatRooms: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversation details
  const mockChatId = 'chat_room_manoj_sarah_123';
  const dietitianId = 'sarah_dietitian_123';
  const clientId = user?.id || 'manoj_client_123';

  const recipientId = user?.role === 'User' ? dietitianId : clientId;

  useEffect(() => {
    // Connect to Backend Socket Server
    socketRef.current = io(BACKEND_URL);

    // Join the private chat room
    socketRef.current.emit('join_room', { chatId: mockChatId });

    // Listeners
    socketRef.current.on('receive_message', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socketRef.current.on('user_typing', ({ userId, isTyping: typingState }: any) => {
      if (userId !== user?.id) {
        setPartnerTyping(typingState);
      }
    });

    // Seed initial dummy messages
    setMessages([
      {
        senderId: dietitianId,
        messageText: 'Hello Manoj! I reviewed your logged oatmeal breakfast from this morning. It looks solid. Let us increase your water intake today to hit 3000ml.',
        createdAt: new Date(Date.now() - 60000).toISOString(),
        isRead: true
      }
    ]);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Emit via socket
    socketRef.current.emit('send_message', {
      chatId: mockChatId,
      senderId: user?.id,
      recipientId: recipientId,
      messageText: inputMessage.trim(),
      image: null
    });

    // Add locally to list immediately
    const localMsg = {
      senderId: user?.id,
      messageText: inputMessage.trim(),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setMessages((prev) => [...prev, localMsg]);
    setInputMessage('');
    scrollToBottom();

    // Reset typing state
    socketRef.current.emit('typing', { chatId: mockChatId, userId: user?.id, isTyping: false });
    setIsTyping(false);
  };

  const handleInputChange = (val: string) => {
    setInputMessage(val);
    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', { chatId: mockChatId, userId: user?.id, isTyping: true });
    }

    if (val.trim() === '') {
      setIsTyping(false);
      socketRef.current.emit('typing', { chatId: mockChatId, userId: user?.id, isTyping: false });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight">Direct Consultation Channel</h2>
        <p className="text-xs text-slate-400">Secure real-time end-to-end messaging with your assigned platform expert</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Contact List sidebar */}
        <div className="glass-card p-4 border-slate-200/50 dark:border-slate-800/40 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Conversations</span>
          <div className="flex items-center gap-3 p-2 bg-emerald-500/10 rounded-xl cursor-pointer border border-emerald-500/20">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">SM</div>
            <div>
              <p className="text-xs font-bold">{user?.role === 'User' ? 'Dr. Sarah Miller' : 'Manoj Kumar (Client)'}</p>
              <p className="text-[9px] text-emerald-500 font-bold">Online • Consultation Active</p>
            </div>
          </div>
        </div>

        {/* Chat view pane */}
        <div className="lg:col-span-3 glass-card p-5 border-slate-200/50 dark:border-slate-800/40 h-[500px] flex flex-col justify-between">
          {/* Header */}
          <div className="border-b pb-3 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse"></span>
              {user?.role === 'User' ? 'Dr. Sarah Miller' : 'Manoj Kumar'}
            </span>
            <span className="text-slate-400 text-[10px]">Socket Connected</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.map((msg, i) => {
              const isSelf = msg.senderId === user?.id;
              return (
                <div key={i} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] space-y-1`}>
                    <div className={`rounded-xl p-3 text-xs leading-relaxed ${
                      isSelf ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-900 rounded-tl-none border dark:border-slate-800'
                    }`}>
                      {msg.messageText}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[8px] text-slate-400">
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isSelf && (
                        msg.isRead ? <CheckCheck size={10} className="text-emerald-500" /> : <Check size={10} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {partnerTyping && (
              <div className="text-[10px] text-slate-400 italic">
                Writing message...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input text box */}
          <form onSubmit={handleSend} className="flex gap-2 border-t pt-3 dark:border-slate-800">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Write your health logs notes or dietary query..."
              className="glass-input flex-1 text-xs"
            />
            <button type="button" className="btn-secondary py-2.5 px-3">
              <Image size={16} className="text-slate-400" />
            </button>
            <button type="submit" className="btn-primary py-2.5 px-4">
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
