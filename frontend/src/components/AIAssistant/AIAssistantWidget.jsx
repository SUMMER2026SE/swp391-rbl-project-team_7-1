import React, { useState, useEffect, useRef, useCallback } from 'react';
import { aiChatService } from '../../services/aiChatService';
import './AIAssistantWidget.css';

const TYPING_SPEED_MIN = 15;
const TYPING_SPEED_MAX = 30;

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const charIndexRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 50);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, typingText, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && activeSessionId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, activeSessionId]);

  const fetchMessages = useCallback(async (sessionId) => {
    setError(null);
    try {
      const res = await aiChatService.getMessages(sessionId);
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Không thể tải lịch sử trò chuyện.');
    }
  }, []);

  // Initialize and select or create session when chat is opened
  useEffect(() => {
    if (isOpen) {
      const initChat = async () => {
        setError(null);
        try {
          const res = await aiChatService.getSessions();
          if (res.success && res.data && res.data.length > 0) {
            // Select the most recent session
            const lastSession = res.data[0];
            setActiveSessionId(lastSession.session_id);
            fetchMessages(lastSession.session_id);
          } else {
            // No sessions exist, auto-create one
            const createRes = await aiChatService.createSession();
            if (createRes.success && createRes.data) {
              setActiveSessionId(createRes.data.session_id);
              setMessages([]);
            }
          }
        } catch (err) {
          console.error('Failed to initialize AI Chat session:', err);
          setError('Không thể kết nối với dịch vụ Trợ lý AI.');
        }
      };
      initChat();
    }
  }, [isOpen, fetchMessages]);

  const handleResetChat = async () => {
    if (sending || isTyping) return;
    if (!window.confirm('Bạn có muốn làm mới cuộc trò chuyện và xóa lịch sử chat này không?')) return;
    
    setError(null);
    setSending(true);
    try {
      if (activeSessionId) {
        await aiChatService.deleteSession(activeSessionId);
      }
      
      const res = await aiChatService.createSession();
      if (res.success && res.data) {
        setActiveSessionId(res.data.session_id);
        setMessages([]);
        setTypingText('');
        setIsTyping(false);
      }
    } catch (err) {
      console.error('Failed to reset chat session:', err);
      setError('Lỗi khi làm mới cuộc trò chuyện.');
    } finally {
      setSending(false);
    }
  };

  const typeResponse = (text) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    setIsTyping(true);
    setTypingText('');
    charIndexRef.current = 0;
    
    const typeNextChar = () => {
      if (charIndexRef.current < text.length) {
        setTypingText(text.substring(0, charIndexRef.current + 1));
        charIndexRef.current++;
        const delay = TYPING_SPEED_MIN + Math.random() * (TYPING_SPEED_MAX - TYPING_SPEED_MIN);
        typingTimeoutRef.current = setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        setTypingText(text);
      }
    };
    
    typeNextChar();
  };

  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (!message || !activeSessionId || sending || isTyping) return;

    setSending(true);
    setError(null);

    // Add user message immediately
    const tempUserMsg = { 
      role: 'user', 
      content: message, 
      created_at: new Date().toISOString(),
      _id: Date.now()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setInputMessage('');

    try {
      const res = await aiChatService.sendMessage(activeSessionId, message);
      if (res.success && res.data) {
        const aiResponse = res.data.reply;
        
        // Add AI message placeholder
        const aiMsg = { 
          role: 'assistant', 
          content: aiResponse, 
          created_at: new Date().toISOString(),
          _id: Date.now() + 1
        };
        setMessages(prev => [...prev, aiMsg]);
        
        // Start typing effect
        typeResponse(aiResponse);
      } else {
        setError('Không gửi được tin nhắn.');
        setMessages(prev => prev.filter(m => m._id !== tempUserMsg._id));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => prev.filter(m => m._id !== tempUserMsg._id));
      setError('Lỗi kết nối. Vui lòng thử lại sau.');
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

  const renderMessageContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="ai-msg-link">$1</a>');
      
      if (processed.trim().startsWith('- ') || processed.trim().startsWith('• ')) {
        const text = processed.trim().substring(2);
        return <li key={i} className="ai-msg-li" dangerouslySetInnerHTML={{ __html: text }} />;
      }
      if (/^\d+\.\s/.test(processed.trim())) {
        const text = processed.trim().replace(/^\d+\.\s/, '');
        return <li key={i} className="ai-msg-li" dangerouslySetInnerHTML={{ __html: text }} />;
      }
      if (processed.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="ai-msg-p" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div className="ai-assistant-container">
      {/* Floating Button */}
      <button
        className={`ai-fab ${isOpen ? 'ai-fab-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Hỏi Trợ lý AI"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-white text-[24px]">close</span>
        ) : (
          <div className="ai-fab-content">
            <span className="material-symbols-outlined text-white text-[26px]">smart_toy</span>
            <span className="ai-fab-badge">AI</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div className={`ai-chat-window ${isOpen ? 'ai-chat-open' : ''}`}>
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-header-left">
            <div className="ai-header-avatar">
              <span className="material-symbols-outlined text-[20px] text-white">smart_toy</span>
            </div>
            <div className="ai-header-info">
              <h3 className="ai-header-title">Trợ lý ảo FJMS</h3>
              <p className="ai-header-status">
                {isTyping ? 'Đang soạn câu trả lời...' : 'Sẵn sàng hỗ trợ'}
              </p>
            </div>
          </div>
          <div className="ai-header-actions">
            <button
              className="ai-header-btn"
              onClick={handleResetChat}
              title="Làm mới đoạn chat"
              disabled={sending || isTyping}
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="ai-messages-area">
          {error && (
            <div className="ai-error">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}
          
          <div className="ai-messages-list">
            {messages.length === 0 && !sending ? (
              <div className="ai-welcome-box">
                <span className="material-symbols-outlined ai-welcome-icon">chat_bubble</span>
                <p className="ai-welcome-title">Chào bạn! Mình có thể giúp gì?</p>
                <p className="ai-welcome-desc">Hãy hỏi mình về dự án phù hợp, cách nạp/rút tiền, ký quỹ VNPay Escrow hoặc tranh chấp nhé!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : 'ai-message-ai'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="ai-message-avatar">
                      <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                    </div>
                  )}
                  <div className={`ai-message-content ${msg.role === 'user' ? 'ai-msg-user-bubble' : 'ai-msg-ai-bubble'}`}>
                    {msg.role === 'assistant' && idx === messages.length - 1 && isTyping ? (
                      <div className="ai-typing-content">
                        {renderMessageContent(typingText)}
                        <span className="ai-typing-cursor">|</span>
                      </div>
                    ) : (
                      <div className="ai-msg-text">
                        {renderMessageContent(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {/* Sending indicator */}
            {sending && !isTyping && (
              <div className="ai-message ai-message-ai">
                <div className="ai-message-avatar">
                  <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                </div>
                <div className="ai-message-content">
                  <div className="ai-typing-indicator">
                    <span className="ai-typing-dot"></span>
                    <span className="ai-typing-dot"></span>
                    <span className="ai-typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Footer / Input */}
        <div className="ai-chat-footer">
          <div className="ai-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi tại đây..."
              disabled={sending || isTyping}
              className="ai-input"
            />
            <button
              className="ai-send-btn"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sending || isTyping}
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}