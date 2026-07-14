import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';

export default function MessagesFreelancer() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const [showKeywordWarning, setShowKeywordWarning] = useState(false);

  const containsOffPlatformKeyword = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    const keywords = [
      'zalo', 'sđt', 'phone', 'điện thoại', 'chuyển khoản', 'ngân hàng', 
      'stk', 'banking', 'giao dịch ngoài', 'facebook', 'fb', 'telegram', 
      'tele', 'email', 'mail', 'viber', 'liên hệ', 'ck'
    ];
    const phoneRegex = /[0-9]{6,}/;
    return keywords.some(kw => lower.includes(kw)) || phoneRegex.test(lower);
  };

  useEffect(() => {
    setShowKeywordWarning(containsOffPlatformKeyword(messageText));
  }, [messageText]);

  const socketRef = useRef(null);
  const activeConvRef = useRef(null);
  const conversationsRef = useRef([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Request Notification Permissions on Mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Sync unread status with Sidebar
  useEffect(() => {
    window.dispatchEvent(new Event('chatReadUpdate'));
  }, [conversations]);

  // Keep reference of activeConv to avoid closure issues in socket listener
  useEffect(() => {
    activeConvRef.current = activeConv;
    if (activeConv) {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('join_room', activeConv.id);
      }
      loadMessages(activeConv);
      handleMarkAsRead(activeConv);
    }
  }, [activeConv]);

  const handleMarkAsRead = async (conv) => {
    try {
      await chatService.markMessagesAsRead(conv.projectId, conv.partnerId);
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error('Lỗi khi đánh dấu đã đọc:', err);
    }
  };

  // Load conversations and initialize socket
  useEffect(() => {
    let activeSocket = null;
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations('FREELANCER');
        const convList = data.conversations || [];
        setConversations(convList);

        // Query initial online status for partners
        const partnerIds = convList.map(c => c.partnerId).filter(Boolean);
        if (partnerIds.length > 0 && activeSocket) {
          activeSocket.emit('check_online_status', partnerIds);
        }
        
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

    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';
    
    const socket = io(socketUrl, {
      transports: ['websocket'],
      extraHeaders: {
        "ngrok-skip-browser-warning": "true"
      }
    });
    socketRef.current = socket;
    activeSocket = socket;

    fetchConversations();

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      socket.emit('register_user', user?.userId || user?.user_id || user?.id);
      if (activeConvRef.current) {
        socket.emit('join_room', activeConvRef.current.id);
      }
    });

    socket.on('online_status_response', (statuses) => {
      setOnlineStatuses(prev => ({ ...prev, ...statuses }));
    });

    socket.on('user_status_change', (data) => {
      const { userId, status, lastSeen } = data;
      setOnlineStatuses(prev => ({
        ...prev,
        [userId]: { status, lastSeen }
      }));
    });

    socket.on('receive_message', (msg) => {
      const active = activeConvRef.current;
      const isMyOwnMessage = Number(msg.sender_id) === Number(user?.userId || user?.user_id || user?.id);

      if (active && Number(msg.project_id) === Number(active.projectId)) {
        const isGroupMatch = active.type === 'GROUP' && msg.contract_id === null;
        const isDirectMatch = active.type === 'DIRECT' && 
          (Number(msg.sender_id) === Number(active.partnerId) || isMyOwnMessage);

        if (isGroupMatch || isDirectMatch) {
          setMessages((prev) => [...prev, msg]);
          if (!isMyOwnMessage) {
            chatService.markMessagesAsRead(active.projectId, active.partnerId || null).catch(err => console.error(err));
          }
        }
      }

      // Show system notifications for incoming messages if browser permission granted
      if (!isMyOwnMessage) {
        const isCurrentActive = active && Number(msg.project_id) === Number(active.projectId) &&
          (active.type === 'GROUP' ? msg.contract_id === null : Number(msg.sender_id) === Number(active.partnerId));

        if (!isCurrentActive) {
          if (Notification.permission === 'granted') {
            // Find matched conv in conversations list to extract names
            const matchedConv = conversationsRef.current ? conversationsRef.current.find(c => Number(c.projectId) === Number(msg.project_id)) : null;
            const senderName = matchedConv ? matchedConv.name : (msg.sender_name || 'Đối tác');
            const projectName = matchedConv ? matchedConv.projectName : 'Dự án';
            const senderAvatar = matchedConv ? matchedConv.avatarUrl : null;

            const notify = new Notification(`Tin nhắn từ ${senderName} [${projectName}]`, {
              body: msg.message_content,
              tag: `msg-${msg.project_id}-${msg.sender_id}`,
              icon: senderAvatar || undefined
            });

            notify.onclick = () => {
              window.focus();
              const convId = msg.contract_id === null && msg.recipient_id === null 
                ? `group-${msg.project_id}`
                : `direct-${msg.project_id}-${user?.userId || user?.user_id || user?.id}`;
              
              navigate('/messages-freelancer', { state: { selectConvId: convId } });
            };
          }
        }
      }

      // Update last message in sidebar list
      setConversations((prevConvs) => 
        prevConvs.map((conv) => {
          const isMatch = Number(conv.projectId) === Number(msg.project_id) && 
            (conv.type === 'GROUP' 
              ? msg.contract_id === null 
              : (Number(msg.sender_id) === Number(conv.partnerId) || isMyOwnMessage));
          if (isMatch) {
            const isCurrentlyActive = active && active.id === conv.id;
            return {
              ...conv,
              lastMessage: msg.message_content,
              lastMessageTime: msg.sent_at,
              lastMessageSender: msg.sender_id,
              unreadCount: (!isCurrentlyActive && !isMyOwnMessage) 
                ? (conv.unreadCount || 0) + 1 
                : 0
            };
          }
          return conv;
        })
      );
    });

    return () => {
      socket.disconnect();
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

  const getStatusText = (partnerId) => {
    const info = onlineStatuses[partnerId];
    if (!info || info.status === 'OFFLINE') {
      if (!info?.lastSeen) return 'Ngoại tuyến';
      const diffMs = Date.now() - new Date(info.lastSeen).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Vừa mới rời mạng';
      if (diffMins < 60) return `Hoạt động ${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Hoạt động ${diffHours} giờ trước`;
      return `Hoạt động ${Math.floor(diffHours / 24)} ngày trước`;
    }
    return 'Đang trực tuyến';
  };
  const totalUnreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const filteredConvs = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 h-full flex flex-col bg-slate-50 font-sans">
      {/*  Messages Dual Pane Layout  */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/*  Left Pane: Conversation List  */}
        <aside className="w-80 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] overflow-hidden shrink-0">
          {/*  Search  */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Hộp thư</h2>
              <span className="bg-teal-50 text-[#0F766E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-100">
                {totalUnreadCount > 0 ? `${totalUnreadCount} tin nhắn chưa đọc` : '0 tin nhắn chưa đọc'}
              </span>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F766E] text-[18px] transition-colors">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/10 focus:border-[#0F766E] transition-all" 
                placeholder="Tìm kiếm tin nhắn..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/*  List  */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filteredConvs.map((conv) => {
              const isActive = activeConv && activeConv.id === conv.id;
              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveConv(conv)}
                  className={`p-4 cursor-pointer transition-all duration-300 relative flex items-center justify-between group border-l-4 ${isActive ? 'border-[#0F766E] bg-gradient-to-r from-teal-50/50 to-white' : 'border-transparent bg-white hover:bg-slate-50/80'}`}
                >
                  <div className="flex gap-3 w-full min-w-0 transition-transform duration-200 group-hover:translate-x-1">
                    <div className="relative shrink-0">
                      {conv.avatarUrl ? (
                        <img alt={conv.name} className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm" src={conv.avatarUrl} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 text-[#0F766E] flex items-center justify-center font-extrabold text-sm border border-teal-200 shadow-sm">
                          {conv.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${onlineStatuses[conv.partnerId]?.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`text-sm truncate ${isActive ? 'font-bold text-teal-950' : 'font-semibold text-slate-800'}`}>{conv.name}</h3>
                        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                          {conv.lastMessageTime && (
                            <span className="text-[9px] text-slate-400 font-medium">
                              {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="bg-red-500 text-white font-extrabold text-[8px] h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center animate-pulse shadow-sm shadow-red-300">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold mb-1 truncate">{conv.projectName}</div>
                      <p className={`text-xs truncate ${isActive ? 'text-slate-700 font-semibold' : 'text-slate-500 font-medium'}`}>
                        {Number(conv.lastMessageSender) === Number(user?.userId || user?.user_id || user?.id) ? 'Bạn: ' : ''}{conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredConvs.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 font-semibold">
                <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">forum</span>
                <p>Không tìm thấy cuộc trò chuyện nào.</p>
              </div>
            )}
          </div>
        </aside>

        {/*  Right Pane: Active Chat Window  */}
        <section className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] overflow-hidden relative">
          {activeConv ? (
            <>
              {/*  Chat Header  */}
              <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/85 backdrop-blur-md z-10 shadow-[0_1px_2px_rgba(15,23,42,0.01)]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeConv.avatarUrl ? (
                      <img alt={activeConv.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" src={activeConv.avatarUrl} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 text-[#0F766E] flex items-center justify-center font-extrabold text-sm border border-teal-200">
                        {activeConv.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${onlineStatuses[activeConv.partnerId]?.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">{activeConv.name}</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {onlineStatuses[activeConv.partnerId]?.status === 'ONLINE' ? (
                        <>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span> 
                          <span className="text-[10px] text-slate-500 font-semibold">{activeConv.projectName} • Đang trực tuyến</span>
                        </>
                      ) : (
                        <>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-300"></span>
                          </span> 
                          <span className="text-[10px] text-slate-500 font-semibold">{activeConv.projectName} • {getStatusText(activeConv.partnerId)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/*  Chat History  */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50">
                {(() => {
                  const lastViolationIndex = [...messages].reverse().findIndex(msg => containsOffPlatformKeyword(msg.message_content));
                  const actualLastViolationIndex = lastViolationIndex !== -1 ? messages.length - 1 - lastViolationIndex : -1;
                  
                  return messages.map((msg, index) => {
                    const isMe = Number(msg.sender_id) === Number(user?.userId || user?.user_id || user?.id);
                    const hasViolation = index === actualLastViolationIndex;
                    return (
                      <React.Fragment key={index}>
                        <div className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : ''}`}>
                          {!isMe && (
                            <img 
                              alt={msg.sender_name || 'Partner'} 
                              className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 shadow-sm border border-slate-200" 
                              src={msg.sender_avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8HmHJcnrB-_zZ4oWacG9OTeL65c8Vo_kJc6J_X7O0u97vFVJGDINe9MyCoIizF9E2PioDbKjGwStuC925yCyCe60Ci9hcxAacK5pby7VkBsYZ7DTfDlZOpcWYPAZLcMMm-hR3F4pp6dDi2KTaD05gO_C9u0YrU6F5EEfDB7fLgeLtm0FXBsb5Lw0QBQNelOyFJxxegHiZhR_t7DKZXSMVvzWkSoku9uaWCJyS33fXgfqW4Y7j44UJReky1WDiCrEHWf3D7LTUoY8'} 
                            />
                          )}
                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium border ${isMe ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-800 rounded-tr-sm' : 'bg-white text-slate-800 border-slate-200/80 rounded-tl-sm'}`}>
                              {activeConv.type === 'GROUP' && !isMe && (
                                <p className="text-[10px] font-bold text-teal-700 mb-1">{msg.sender_name}</p>
                              )}
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.message_content}</p>
                            </div>
                            <div className="text-[9px] text-slate-400 font-bold mt-1.5 ml-1">
                              {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        {hasViolation && (
                          <div className="w-full flex items-center gap-3 my-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 shadow-sm select-none">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[18px] text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider mb-0.5">Hệ thống bảo vệ bạn</p>
                              <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                                Lưu ý: Để tránh rủi ro lừa đảo, vui lòng hạn chế chia sẻ thông tin liên lạc và giao dịch ngoài nền tảng. Chúc bạn có một làm việc an toàn và hiệu quả!
                              </p>
                            </div>
                          </div>
                        )}
                    </React.Fragment>
                  );
                });
              })()}
                <div ref={messagesEndRef} />
              </div>

              {/*  Chat Input Area  */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 shrink-0 z-10">
                <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-4 focus-within:ring-teal-600/5 focus-within:border-[#0F766E] transition-all shadow-sm">
                  <button type="button" className="p-2 text-slate-400 hover:text-[#0F766E] hover:bg-slate-200/50 transition-colors rounded-xl shrink-0 mb-0.5">
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
                  <button type="submit" className="p-2.5 bg-[#0F766E] text-white hover:bg-[#0D5E58] rounded-xl transition-all shrink-0 mb-0.5 shadow-md hover:shadow-lg active:scale-[0.96] border-none cursor-pointer">
                    <span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>send</span>
                  </button>
                </div>

              </form>

            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
              <span className="material-symbols-outlined text-[72px] mb-4 text-slate-300">chat_bubble_outline</span>
              <p className="text-sm font-bold text-slate-500">Chọn một cuộc trò chuyện từ danh sách để nhắn tin.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
