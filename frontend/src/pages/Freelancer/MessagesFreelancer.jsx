import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';

export default function MessagesFreelancer() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const socketRef = useRef(null);
  const activeConvRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Keep reference of activeConv to avoid closure issues in socket listener
  useEffect(() => {
    activeConvRef.current = activeConv;
    if (activeConv && socketRef.current) {
      socketRef.current.emit('join_room', activeConv.id);
      loadMessages(activeConv);
    }
  }, [activeConv]);

  // Load conversations and initialize socket
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        const convList = data.conversations || [];
        setConversations(convList);
        
        // Auto-select targeted conversation if passed via location state
        if (location.state?.selectConvId) {
          const target = convList.find(c => c.id === location.state.selectConvId);
          if (target) {
            setActiveConv(target);
            return;
          }
        }

        if (convList.length > 0) {
          setActiveConv(convList[0]);
        }
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };

    fetchConversations();

    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';
    
    socketRef.current = io(socketUrl);

    socketRef.current.on('receive_message', (msg) => {
      const active = activeConvRef.current;
      if (active && Number(msg.project_id) === Number(active.projectId)) {
        if (active.type === 'GROUP' && msg.contract_id === null) {
          setMessages((prev) => [...prev, msg]);
        } else if (active.type === 'DIRECT' && 
          (Number(msg.sender_id) === Number(active.partnerId) || Number(msg.sender_id) === Number(user?.userId || user?.user_id || user?.id))) {
          setMessages((prev) => [...prev, msg]);
        }
      }

      // Update last message in sidebar list
      setConversations((prevConvs) => 
        prevConvs.map((conv) => {
          const isMatch = Number(conv.projectId) === Number(msg.project_id) && 
            (conv.type === 'GROUP' 
              ? msg.contract_id === null 
              : (Number(msg.sender_id) === Number(conv.partnerId) || Number(msg.sender_id) === Number(user?.userId || user?.user_id || user?.id)));
          if (isMatch) {
            return {
              ...conv,
              lastMessage: msg.message_content,
              lastMessageTime: msg.sent_at,
              lastMessageSender: msg.sender_id
            };
          }
          return conv;
        })
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (conv) => {
    try {
      const data = await chatService.getMessages(conv.projectId, conv.type, conv.partnerId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load message history', err);
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeConv || !socketRef.current) return;

    const messageData = {
      projectId: activeConv.projectId,
      contractId: activeConv.contractId || null,
      senderId: user?.userId || user?.user_id || user?.id,
      recipientId: activeConv.partnerId || null,
      messageContent: messageText,
      messageType: 'TEXT',
      room: activeConv.id
    };

    socketRef.current.emit('send_message', messageData);
    setMessageText('');
  };

  const filteredConvs = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 h-full flex flex-col bg-slate-50">
      {/*  Messages Dual Pane Layout  */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/*  Left Pane: Conversation List  */}
        <aside className="w-80 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden shrink-0">
          {/*  Search  */}
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors" 
                placeholder="Tìm kiếm tin nhắn..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/*  List  */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map((conv) => {
              const isActive = activeConv && activeConv.id === conv.id;
              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveConv(conv)}
                  className={`p-4 border-b border-slate-200 cursor-pointer transition-colors border-l-4 ${isActive ? 'border-[#0F766E] bg-slate-50' : 'border-transparent hover:bg-slate-50'}`}
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      {conv.avatarUrl ? (
                        <img alt={conv.name} className="w-10 h-10 rounded-full object-cover" src={conv.avatarUrl} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold text-base border border-teal-200">
                          {conv.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-teal-950' : 'text-slate-800'}`}>{conv.name}</h3>
                        {conv.lastMessageTime && (
                          <span className="text-[9px] text-teal-700">
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-600 mb-1 truncate">{conv.projectName}</div>
                      <p className="text-xs text-slate-600 truncate">
                        {Number(conv.lastMessageSender) === Number(user?.userId || user?.user_id || user?.id) ? 'Bạn: ' : ''}{conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredConvs.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                Không tìm thấy cuộc trò chuyện nào.
              </div>
            )}
          </div>
        </aside>

        {/*  Right Pane: Active Chat Window  */}
        <section className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden relative">
          {activeConv ? (
            <>
              {/*  Chat Header  */}
              <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  {activeConv.avatarUrl ? (
                    <img alt={activeConv.name} className="w-10 h-10 rounded-full object-cover" src={activeConv.avatarUrl} />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold text-base border border-teal-200">
                      {activeConv.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="font-headline-xl text-body-base font-semibold text-slate-800">{activeConv.name}</h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#0F766E] rounded-full"></div>
                      <span className="font-body-sm text-[12px] text-slate-600">{activeConv.projectName} • Đang trực tuyến</span>
                    </div>
                  </div>
                </div>
              </div>

              {/*  Chat History  */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50">
                {messages.map((msg, index) => {
                  const isMe = Number(msg.sender_id) === Number(user?.userId || user?.user_id || user?.id);
                  return (
                    <div key={index} className={`flex gap-4 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : ''}`}>
                      {!isMe && (
                        <img 
                          alt={msg.sender_name || 'Partner'} 
                          className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" 
                          src={msg.sender_avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8HmHJcnrB-_zZ4oWacG9OTeL65c8Vo_kJc6J_X7O0u97vFVJGDINe9MyCoIizF9E2PioDbKjGwStuC925yCyCe60Ci9hcxAacK5pby7VkBsYZ7DTfDlZOpcWYPAZLcMMm-hR3F4pp6dDi2KTaD05gO_C9u0YrU6F5EEfDB7fLgeLtm0FXBsb5Lw0QBQNelOyFJxxegHiZhR_t7DKZXSMVvzWkSoku9uaWCJyS33fXgfqW4Y7j44UJReky1WDiCrEHWf3D7LTUoY8'} 
                        />
                      )}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium border ${isMe ? 'bg-[#0F766E] text-white border-teal-800 rounded-tr-sm' : 'bg-white text-slate-800 border-slate-200 rounded-tl-sm'}`}>
                          {activeConv.type === 'GROUP' && !isMe && (
                            <p className="text-[10px] font-bold text-teal-700 mb-1">{msg.sender_name}</p>
                          )}
                          <p className="whitespace-pre-wrap">{msg.message_content}</p>
                        </div>
                        <div className="font-label-caps text-[9px] text-slate-600 mt-1 ml-1">
                          {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/*  Chat Input Area  */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 shrink-0 z-10">
                <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-[#0F766E] focus-within:ring-1 focus-within:ring-[#0F766E] transition-all">
                  <button type="button" className="p-2 text-slate-600 hover:text-[#0F766E] transition-colors rounded-2xl hover:bg-white shrink-0 mb-0.5">
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                  <textarea 
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm font-medium text-slate-800 py-2.5 max-h-32 min-h-[44px] focus:outline-none" 
                    placeholder="Nhập tin nhắn của bạn..." 
                    rows="1"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  ></textarea>
                  <button type="submit" className="p-2 bg-gradient-to-b from-[#475569] to-[#526171] hover:bg-[#0F766E] text-white rounded-2xl transition-colors shrink-0 mb-0.5 shadow-sm hover:shadow-md border-none cursor-pointer">
                    <span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <span className="material-symbols-outlined text-[64px] mb-4">chat</span>
              <p className="text-sm font-medium">Chọn cuộc trò chuyện ở bên trái để nhắn tin.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
