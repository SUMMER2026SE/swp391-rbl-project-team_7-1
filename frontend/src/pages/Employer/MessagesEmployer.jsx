import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';

export default function MessagesEmployer() {
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

  // Keep a ref of activeConv to avoid closure issues in socket listeners
  useEffect(() => {
    activeConvRef.current = activeConv;
    if (activeConv && socketRef.current) {
      socketRef.current.emit('join_room', activeConv.id);
      loadMessages(activeConv);
    }
  }, [activeConv]);

  // Load conversations list
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

    // Setup Socket connection
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
      
      // Update last message in sidebar
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

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (conv) => {
    try {
      const data = await chatService.getMessages(conv.projectId, conv.type, conv.partnerId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load messages history', err);
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

    // Send via socket (socket handles database save & broadcast)
    socketRef.current.emit('send_message', messageData);
    setMessageText('');
  };

  const filteredConvs = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 flex overflow-hidden bg-slate-50">
      {/*  Left Pane: Conversation List  */}
      <section className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-teal-950 mb-4 tracking-tight">Hộp thư</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all font-medium text-slate-700" 
              placeholder="Tìm kiếm tin nhắn..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConvs.map((conv) => {
            const isActive = activeConv && activeConv.id === conv.id;
            return (
              <div 
                key={conv.id} 
                onClick={() => setActiveConv(conv)}
                className={`p-5 border-b border-slate-100 cursor-pointer transition-colors relative ${isActive ? 'bg-teal-50/50 hover:bg-teal-50' : 'bg-white hover:bg-slate-50'}`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0F766E] rounded-r-full"></div>}
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    {conv.avatarUrl ? (
                      <img alt={conv.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" src={conv.avatarUrl} />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold text-lg border border-teal-200 shadow-sm">
                        {conv.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-sm truncate ${isActive ? 'font-bold text-teal-950' : 'font-semibold text-slate-800'}`}>{conv.name}</h3>
                      {conv.lastMessageTime && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 truncate font-semibold">
                      {Number(conv.lastMessageSender) === Number(user?.userId || user?.user_id || user?.id) ? 'Bạn: ' : ''}{conv.lastMessage}
                    </p>
                    <p className="text-[10px] text-teal-700 mt-1.5 truncate font-medium bg-white px-2 py-0.5 rounded border border-teal-100 w-fit">{conv.projectName}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredConvs.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400 font-medium">
              Không tìm thấy cuộc trò chuyện nào.
            </div>
          )}
        </div>
      </section>
      
      {/*  Right Pane: Active Chat  */}
      <section className="flex-1 flex flex-col bg-slate-50 relative">
        {activeConv ? (
          <>
            {/*  Chat Header  */}
            <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white z-10 shadow-sm">
              <div className="flex items-center gap-5">
                {activeConv.avatarUrl ? (
                  <img alt={activeConv.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src={activeConv.avatarUrl} />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold text-xl border border-teal-200 shadow-sm">
                    {activeConv.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-teal-950 tracking-tight">{activeConv.name}</h2>
                    <span className="bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-teal-100/50 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span>
                      Pro Đã xác thực
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <span>{activeConv.projectName}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5 text-teal-600">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span> Đang trực tuyến
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/*  Chat History Area  */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50 flex flex-col">
              {messages.map((msg, index) => {
                const isMe = Number(msg.sender_id) === Number(user?.userId || user?.user_id || user?.id);
                return (
                  <div key={index} className={`flex gap-4 max-w-2xl ${isMe ? 'self-end' : ''}`}>
                    {!isMe && (
                      <img 
                        alt={msg.sender_name || 'Partner'} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-sm" 
                        src={msg.sender_avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0oc8fVlniObATbJnQ0vldPUceIX09x6mKNMNbxlKE7Ebye75GnZfKbEuH4OGKxkO-Va0fbqWVROoEQg8KwkCmmuyMk7ySE14YuxGQ4y-lQdRQW9z-WE6TOe-ns60EQtcIkQvhLJpwmCjXsMWhZcdu6ikFCCFN4lvpV_pYAVHZknVzu_a666wJ4gySWweZAMClQ0E8VAPuv6s9GQj1o5VVU1jKyl3tSkzeWJpNhO6KyUeAwrZfPHzNa5D2WHC1mxm8KEvkVDx1OpI'} 
                      />
                    )}
                    <div className="space-y-2">
                      <div className={`rounded-2xl p-5 shadow-sm border ${isMe ? 'bg-[#0F766E] text-white border-teal-800 rounded-tr-sm' : 'bg-white text-slate-700 border-slate-200 rounded-tl-sm'}`}>
                        {/* Display sender name in group chats */}
                        {activeConv.type === 'GROUP' && !isMe && (
                          <p className="text-xs font-bold text-teal-700 mb-1">{msg.sender_name}</p>
                        )}
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.message_content}</p>
                        <span className={`text-[10px] block mt-2 text-right font-medium ${isMe ? 'text-teal-100' : 'text-slate-400'}`}>
                          {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            {/*  Message Input Area  */}
            <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-slate-200 z-10 shadow-[0_-4px_20px_rgba(15,23,42,0.02)]">
              {/*  Quick Replies  */}
              <div className="flex gap-3 mb-4 overflow-x-auto custom-scrollbar pb-2">
                {['Trông tuyệt lắm!', 'Chúng ta có thể điều chỉnh chút không?', 'Khi nào chúng ta có thể gọi điện?'].map((reply) => (
                  <button 
                    key={reply}
                    type="button" 
                    onClick={() => setMessageText(reply)}
                    className="whitespace-nowrap px-4 py-2 bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-slate-200 rounded-full text-sm font-semibold transition-all active:scale-[0.98]"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              {/*  Input Box  */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-end gap-2 p-2 focus-within:ring-2 focus-within:ring-teal-600/20 focus-within:border-teal-600 transition-all shadow-sm">
                <button type="button" className="p-2.5 text-slate-400 hover:text-[#0F766E] hover:bg-slate-200 rounded-xl transition-colors shrink-0 mb-0.5">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <textarea 
                  className="flex-1 bg-transparent border-none text-base text-slate-700 focus:ring-0 resize-none py-3 font-medium max-h-32 custom-scrollbar focus:outline-none" 
                  placeholder="Nhập tin nhắn..." 
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
                <button type="submit" className="p-2.5 bg-[#0F766E] text-white hover:bg-[#0D5E58] rounded-xl transition-all shrink-0 mb-0.5 shadow-sm active:scale-[0.98] border-none cursor-pointer">
                  <span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-[64px] mb-4">chat</span>
            <p className="text-lg font-medium">Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu chat.</p>
          </div>
        )}
      </section>
    </main>
  );
}
