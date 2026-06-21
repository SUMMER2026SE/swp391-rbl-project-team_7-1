import React, { useState, useEffect, useRef, useCallback } from 'react';
import { aiChatService } from '../../services/aiChatService';
import './AIAssistantWidget.css';

const TYPING_SPEED_MIN = 20;
const TYPING_SPEED_MAX = 40;

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [fullResponse, setFullResponse] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
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
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen, fetchSessions]);

  const fetchMessages = useCallback(async (sessionId) => {
    setError(null);
    try {
      const res = await aiChatService.getMessages(sessionId);
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages.');
    }
  }, []);

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setMessages([]);
    setTypingText('');
    setFullResponse('');
    setIsTyping(false);
    fetchMessages(sessionId);
    setShowSidebar(false);
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
        setTypingText('');
        setFullResponse('');
        setIsTyping(false);
        setError(null);
        setShowSidebar(false);
      }
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Failed to create new chat.');
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
          setTypingText('');
          setFullResponse('');
          setIsTyping(false);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
      setError('Failed to delete chat.');
    }
  };

  const typeResponse = (text) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    setIsTyping(true);
    setFullResponse(text);
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

        // Refresh sessions to get potential new title
        fetchSessions();
      } else {
        setError('Failed to send message.');
        setMessages(prev => prev.filter(m => m._id !== tempUserMsg._id));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => prev.filter(m => m._id !== tempUserMsg._id));
      setError('Connection error. Please try again.');
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
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderMessageContent = (content) => {
    // Simple markdown-like rendering
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Bold
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet points
      if (processed.trim().startsWith('- ') || processed.trim().startsWith('• ')) {
        const text = processed.trim().substring(2);
        return <li key={i} className="ai-msg-li" dangerouslySetInnerHTML={{ __html: text }} />;
      }
      // Numbered lists
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

  const getCurrentSessionTitle = () => {
    if (!activeSessionId) return 'AI Assistant';
    const session = sessions.find(s => s.session_id === activeSessionId);
    return session?.title || 'AI Assistant';
  };

  return (
    <div className="ai-assistant-container">
      {/* Floating Button */}
      <button
        className={`ai-fab ${isOpen ? 'ai-fab-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"></path>
            <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"></path>
            <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
            <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div className={`ai-chat-window ${isOpen ? 'ai-chat-open' : ''}`}>
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-header-left">
            <div className="ai-header-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"></path>
                <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"></path>
              </svg>
            </div>
            <div className="ai-header-info">
              <h3 className="ai-header-title">AI Assistant</h3>
              <p className="ai-header-status">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <div className="ai-header-actions">
            <button
              className="ai-header-btn"
              onClick={() => setShowSidebar(!showSidebar)}
              title="Chat history"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <button
              className="ai-header-btn"
              onClick={handleNewSession}
              title="New chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="ai-chat-body">
          {/* Sidebar */}
          {showSidebar && (
            <div className="ai-sidebar">
              <div className="ai-sidebar-header">
                <span className="ai-sidebar-title">Chat History</span>
                <button
                  className="ai-sidebar-close"
                  onClick={() => setShowSidebar(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="ai-sidebar-list">
                {sessions.length === 0 ? (
                  <div className="ai-sidebar-empty">No conversations yet</div>
                ) : (
                  sessions.map(session => (
                    <div
                      key={session.session_id}
                      className={`ai-sidebar-item ${activeSessionId === session.session_id ? 'active' : ''}`}
                      onClick={() => handleSelectSession(session.session_id)}
                    >
                      <div className="ai-sidebar-item-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <div className="ai-sidebar-item-content">
                        <span className="ai-sidebar-item-title">{session.title || 'New Chat'}</span>
                        <span className="ai-sidebar-item-time">{formatTime(session.updated_at)}</span>
                      </div>
                      <button
                        className="ai-sidebar-item-delete"
                        onClick={(e) => handleDeleteSession(e, session.session_id)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="ai-messages-area">
            {!activeSessionId ? (
              <div className="ai-welcome">
                <div className="ai-welcome-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"></path>
                    <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"></path>
                    <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
                    <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
                  </svg>
                </div>
                <h2 className="ai-welcome-title">FJMS AI Assistant</h2>
                <p className="ai-welcome-text">
                  I'm here to help you with projects, proposals, contracts, escrow, and more!
                </p>
                <button className="ai-welcome-btn" onClick={handleNewSession}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Start New Chat
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="ai-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                  </div>
                )}
                <div className="ai-messages-list">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg._id || idx}
                      className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : 'ai-message-ai'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="ai-message-avatar">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"></path>
                            <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"></path>
                          </svg>
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
                        <div className={`ai-msg-time ${msg.role === 'user' ? 'ai-msg-time-user' : 'ai-msg-time-ai'}`}>
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Sending indicator */}
                  {sending && !isTyping && (
                    <div className="ai-message ai-message-ai">
                      <div className="ai-message-avatar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"></path>
                          <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"></path>
                        </svg>
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
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        {activeSessionId && (
          <div className="ai-chat-footer">
            <div className="ai-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about FJMS..."
                disabled={sending || isTyping}
                className="ai-input"
              />
              <button
                className="ai-send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sending || isTyping}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}