import React, { useState, useEffect, useRef, useCallback } from 'react';
import { aiChatService } from '../../services/aiChatService';

export default function AIChatPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await aiChatService.getSessions();
      if (res.success) {
        setSessions(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const fetchMessages = useCallback(async (sessionId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiChatService.getMessages(sessionId);
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    fetchMessages(sessionId);
  };

  const handleNewSession = async () => {
    try {
      const res = await aiChatService.createSession();
      if (res.success && res.data) {
        const newSession = {
          session_id: res.data.session_id,
          title: res.data.title,
          user_id: res.data.user_id
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.session_id);
        setMessages([]);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Không thể tạo phiên chat mới.');
    }
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      const res = await aiChatService.deleteSession(sessionId);
      if (res.success) {
        setSessions(prev => prev.filter(s => s.session_id !== sessionId));
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
      setError('Không thể xóa phiên chat.');
    }
  };

  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (!message || !activeSessionId || sending) return;

    setSending(true);
    setError(null);

    // Optimistically add user message
    const tempUserMsg = { role: 'user', content: message, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMsg]);
    setInputMessage('');

    try {
      const res = await aiChatService.sendMessage(activeSessionId, message);
      if (res.success && res.data) {
        // Add AI response
        const aiMsg = { role: 'assistant', content: res.data.reply, created_at: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);

        // Update session list to reflect new timestamp
        setSessions(prev => prev.map(s => {
          if (s.session_id === activeSessionId) {
            // Update title if it was "New Chat" and this is the first message
            return { ...s, updated_at: new Date().toISOString() };
          }
          return s;
        }));

        // Refresh sessions to get potential new title
        fetchSessions();
      } else {
        setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => prev.slice(0, -1)); // Remove optimistic message
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0]">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-bold hover:bg-[#0D5E58] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center text-[#64748b] text-sm py-8">No chat sessions</div>
          ) : (
            sessions.map(session => (
              <div
                key={session.session_id}
                onClick={() => handleSelectSession(session.session_id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  activeSessionId === session.session_id
                    ? 'bg-teal-50 text-[#0F766E] border border-teal-100/50'
                    : 'text-[#475569] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="material-symbols-outlined text-[18px] shrink-0">chat</span>
                  <span className="text-sm font-medium truncate">{session.title || 'New Chat'}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(e, session.session_id)}
                  className="p-1 rounded-lg hover:bg-red-50 text-[#94a3b8] hover:text-red-500 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!activeSessionId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ecfdf5] text-[#0f766e] grid place-items-center">
                <span className="material-symbols-outlined text-[32px]">smart_toy</span>
              </div>
              <h2 className="text-xl font-semibold text-[#334155] mb-2">FJMS Assistant</h2>
              <p className="text-[#475569] mb-6">Select a conversation or start a new chat</p>
              <button
                onClick={handleNewSession}
                className="px-6 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-bold hover:bg-[#0D5E58] transition-all"
              >
                Start New Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-[#E2E8F0] bg-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#0f766e] grid place-items-center">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#334155]">FJMS Assistant</h3>
                  <p className="text-xs text-[#64748b]">AI Support Chatbot</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">{error}</div>
              )}
              {loading ? (
                <div className="text-center text-[#64748b] py-8">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-[#64748b] py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-[#0F766E] text-white rounded-br-md'
                          : 'bg-white border border-[#E2E8F0] text-[#334155] rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-[11px] mt-1 ${msg.role === 'user' ? 'text-teal-100' : 'text-[#94a3b8]'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about FJMS platform..."
                  disabled={sending}
                  className="flex-1 px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#334155] focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors placeholder:text-[#94a3b8]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sending}
                  className="px-4 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-bold hover:bg-[#0D5E58] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}