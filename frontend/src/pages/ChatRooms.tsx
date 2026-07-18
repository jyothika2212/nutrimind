import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import io from 'socket.io-client';
import { Send, Image, User, Check, CheckCheck, MessageSquare } from 'lucide-react';
import api, { BACKEND_URL } from '../services/api';

const AI_DOCTOR_ID = '414920446f63746f72204944';

export const ChatRooms: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  
  // Dynamic chat states
  const [clients, setClients] = useState<any[]>([]);
  const [activeClient, setActiveClient] = useState<any>(null);
  const [dietitian, setDietitian] = useState<any>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isUser = user?.role === 'User';
  const assignedDietitianId = user?.userDetails?.assignedDietitian;

  // Compute recipient dynamically
  const recipientId = isUser 
    ? (selectedRecipientId || assignedDietitianId || AI_DOCTOR_ID)
    : (activeClient?._id || '');

  // Compute deterministic chatId
  const getChatId = (id1: string, id2: string) => {
    if (!id1 || !id2) return '';
    return [id1, id2].sort().join('_');
  };
  const activeChatId = getChatId(user?.id || '', recipientId);

  // 1. Fetch metadata on load
  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        if (isUser) {
          if (assignedDietitianId) {
            const res = await api.get('/dietitian/list');
            const found = res.data.find((d: any) => d._id === assignedDietitianId);
            if (found) {
              setDietitian(found);
            }
          }
          setSelectedRecipientId(assignedDietitianId || AI_DOCTOR_ID);
        } else {
          // If Dietitian, fetch assigned clients list
          const res = await api.get('/dietitian/clients');
          setClients(res.data);
          if (res.data.length > 0) {
            setActiveClient(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching chat metadata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [user]);

  // 2. Fetch history and connect sockets when activeChatId changes
  useEffect(() => {
    if (!activeChatId || !recipientId) return;

    // Fetch history
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/history/${activeChatId}`);
        setMessages(res.data);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchHistory();

    // Connect socket
    socketRef.current = io(BACKEND_URL);
    socketRef.current.emit('join_room', { chatId: activeChatId });

    // Listeners
    socketRef.current.on('receive_message', (msg: any) => {
      if (msg.chatId === activeChatId) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 50);
      }
    });

    socketRef.current.on('user_typing', ({ userId, isTyping: typingState }: any) => {
      if (userId === recipientId) {
        setPartnerTyping(typingState);
      }
    });

    // Mark read
    socketRef.current.emit('mark_read', { chatId: activeChatId, userId: user?.id });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [activeChatId, recipientId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatId) return;

    const msgText = inputMessage.trim();

    // Emit via socket
    socketRef.current.emit('send_message', {
      chatId: activeChatId,
      senderId: user?.id,
      recipientId: recipientId,
      messageText: msgText,
      image: null
    });

    // Add locally immediately to prevent lag
    const localMsg = {
      chatId: activeChatId,
      senderId: user?.id,
      recipientId: recipientId,
      messageText: msgText,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setMessages((prev) => [...prev, localMsg]);
    setInputMessage('');
    setTimeout(scrollToBottom, 50);

    // Reset typing
    socketRef.current.emit('typing', { chatId: activeChatId, userId: user?.id, isTyping: false });
    setIsTyping(false);
  };

  const handleInputChange = (val: string) => {
    setInputMessage(val);
    if (!activeChatId) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', { chatId: activeChatId, userId: user?.id, isTyping: true });
    }

    if (val.trim() === '') {
      setIsTyping(false);
      socketRef.current.emit('typing', { chatId: activeChatId, userId: user?.id, isTyping: false });
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isUser && clients.length === 0) {
    return (
      <div className="space-y-6 pb-20">
        <div>
          <h2 className="font-extrabold text-2xl tracking-tight">Direct Consultation Channel</h2>
          <p className="text-xs text-slate-400">Secure real-time end-to-end messaging with your assigned clients</p>
        </div>
        <div className="glass-card p-12 text-center space-y-4 border-slate-200/50 dark:border-slate-800/40">
          <MessageSquare className="mx-auto text-slate-400" size={48} />
          <h3 className="font-extrabold text-lg text-slate-700 dark:text-slate-200">No active clients</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You don't have any assigned clients at the moment. When clients are assigned to you, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  const partnerName = isUser 
    ? (recipientId === AI_DOCTOR_ID ? 'NutriMind AI Doctor' : (dietitian?.name || 'Dr. Sarah Miller'))
    : activeClient?.name || 'Client';

  const partnerInitials = recipientId === AI_DOCTOR_ID ? 'AI' : partnerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight">Direct Consultation Channel</h2>
        <p className="text-xs text-slate-400">
          {isUser 
            ? 'Secure real-time end-to-end messaging with your assigned platform expert'
            : 'Consult with your active clients and monitor their daily diet reports'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar contacts */}
        <div className="glass-card p-4 border-slate-200/50 dark:border-slate-800/40 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Conversations</span>
          
          {isUser ? (
            <div className="space-y-2">
              {/* Option 1: Assigned Dietitian Specialist */}
              {assignedDietitianId && (
                <div 
                  onClick={() => setSelectedRecipientId(assignedDietitianId)}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer border transition-colors ${
                    recipientId === assignedDietitianId 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 font-bold' 
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                >
                  {dietitian?.profilePicture ? (
                    <img src={dietitian.profilePicture} alt={partnerName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">{partnerInitials}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{dietitian?.name || 'Dietitian Specialist'}</p>
                    <p className="text-[9px] text-emerald-500 font-bold">Online • Specialist</p>
                  </div>
                </div>
              )}

              {/* Option 2: NutriMind AI Doctor */}
              <div 
                onClick={() => setSelectedRecipientId(AI_DOCTOR_ID)}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer border transition-colors ${
                  recipientId === AI_DOCTOR_ID 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 font-bold' 
                    : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                  <MessageSquare size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">NutriMind AI Doctor</p>
                  <p className="text-[9px] text-indigo-500 font-bold">Active 24/7 • AI Assistant</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {clients.map((cli) => {
                const isActive = cli._id === activeClient?._id;
                const initials = cli.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <div 
                    key={cli._id} 
                    onClick={() => setActiveClient(cli)}
                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer border transition-colors ${
                      isActive 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                        : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    {cli.profilePicture ? (
                      <img src={cli.profilePicture} alt={cli.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">{initials}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate">{cli.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase truncate">Client</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat view pane */}
        <div className="lg:col-span-3 glass-card p-5 border-slate-200/50 dark:border-slate-800/40 h-[500px] flex flex-col justify-between">
          {/* Header */}
          <div className="border-b pb-3 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full block animate-pulse ${recipientId === AI_DOCTOR_ID ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
              {partnerName}
            </span>
            <span className="text-slate-400 text-[10px]">{recipientId === AI_DOCTOR_ID ? 'AI Agent Connected' : 'Socket Connected'}</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs py-12 text-center max-w-sm mx-auto">
                {recipientId === AI_DOCTOR_ID 
                  ? 'Hello! I am your NutriMind AI Doctor. Ask me anything about foods, diets, caloric limits, or meal recipes!' 
                  : 'No conversation history. Send a message to start consulting!'}
              </div>
            ) : (
              messages.map((msg, i) => {
                const isSelf = msg.senderId === user?.id;
                return (
                  <div key={i} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%] space-y-1">
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
              })
            )}
            {partnerTyping && (
              <div className="text-[10px] text-slate-400 italic">
                {recipientId === AI_DOCTOR_ID ? 'AI Doctor is analyzing...' : 'Writing message...'}
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
              placeholder={recipientId === AI_DOCTOR_ID ? 'Ask AI Doctor a health or diet question...' : 'Write your health logs notes or dietary query...'}
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
