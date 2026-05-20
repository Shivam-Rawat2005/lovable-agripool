import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, ShieldAlert, Loader2, Wifi, WifiOff } from 'lucide-react';
import api from '../services/api';
import authService from '../services/authService';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Sync user profile from auth service
  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [isOpen]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Polling for messages and status heartbeat
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch status heartbeat and latest messages
        const [statusRes, messagesRes] = await Promise.all([
          api.get('/chat/status').catch(e => { throw e; }),
          api.get('/chat/messages')
        ]);
        
        if (statusRes.data.status === 'connected') {
          setConnected(true);
        }
        setMessages(messagesRes.data || []);
      } catch (error) {
        console.error('Chat connectivity check failed:', error);
        setConnected(false);
      }
    };

    // Initial fetch
    fetchChatData();

    // Poll every 2.5 seconds for real-time synchronization
    const interval = setInterval(fetchChatData, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected) return;

    const messageText = newMessage;
    setNewMessage('');
    setSending(true);

    try {
      const response = await api.post('/chat/messages', { message: messageText });
      setMessages((prev) => [...prev, response.data]);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      // Put message back in input if it failed
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  // Determine current user ID safely
  const currentUserId = user?._id || user?.id;

  // Helper to format message timestamps
  const formatTime = (timeStr) => {
    if (!timeStr) return 'Just now';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  // Helper to retrieve role badge styles
  const getRoleBadgeStyles = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { background: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff' };
      case 'driver':
        return { background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' };
      case 'farmer':
        return { background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' };
      default:
        return { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 99999, fontFamily: '"Outfit", "Inter", system-ui, sans-serif' }}>
      
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-emerald), #059669)',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 30px rgba(4, 120, 87, 0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'rotate(90deg) scale(0.95)' : 'scale(1)',
        }}
        title="AgriPool Help & Live Chat"
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
        
        {/* Connection status dot pulsing on the button */}
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: connected ? '#10b981' : '#ef4444',
          border: '2.5px solid white',
          boxShadow: connected ? '0 0 10px #10b981' : '0 0 10px #ef4444',
          animation: 'pulse 1.8s infinite',
        }} />
      </button>

      {/* Live Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '75px',
          right: 0,
          width: '390px',
          height: '540px',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.25rem',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'panelSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #05503b, var(--primary-emerald))',
            padding: '1.25rem 1.5rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>AgriPool Live Support</span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {user?.role || 'User'}
                </span>
              </div>
              
              {/* Real-time status display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', fontSize: '0.75rem' }}>
                {connected ? (
                  <>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                    <span style={{ color: '#a7f3d0', fontWeight: '600' }}>Connected (Working Fine)</span>
                  </>
                ) : (
                  <>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block', boxShadow: '0 0 6px #f43f5e' }} />
                    <span style={{ color: '#fecdd3', fontWeight: '600' }}>Disconnected (Check backend server)</span>
                  </>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              <X size={16} />
            </button>
          </div>

          {/* Connection Error Banner */}
          {!connected && (
            <div style={{
              background: '#fff1f2',
              borderBottom: '1px solid #ffe4e6',
              padding: '0.75rem 1.5rem',
              color: '#be123c',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontWeight: '600'
            }}>
              <ShieldAlert size={15} style={{ flexShrink: 0, color: '#e11d48' }} />
              <span>Offline: Live synchronization is currently unavailable.</span>
            </div>
          )}

          {/* Messages Stream */}
          <div 
            className="chat-scrollbar"
            style={{
              flex: 1,
              padding: '1.5rem 1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              background: '#f8fafc'
            }}
          >
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '4rem 1rem' }}>
                <div style={{ background: '#f1f5f9', color: 'var(--primary-emerald)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <MessageSquare size={32} />
                </div>
                <p style={{ fontWeight: '800', color: '#334155', marginBottom: '0.35rem', fontSize: '0.95rem' }}>AgriPool Communication Hub</p>
                <p style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '240px', margin: '0 auto', lineHeight: '1.4' }}>Send a message to sync in real-time across Farmers, Drivers, and Admin panels!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender_id === currentUserId;
                const roleBadge = getRoleBadgeStyles(msg.sender_role);
                return (
                  <div key={msg._id || index} style={{
                    display: 'flex',
                    flexDirection: isMe ? 'row-reverse' : 'row',
                    gap: '0.65rem',
                    maxWidth: '85%',
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                  }}>
                    
                    {/* Avatar Badge */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isMe ? 'linear-gradient(135deg, var(--primary-emerald), #047857)' : roleBadge.background,
                      color: isMe ? 'white' : roleBadge.color,
                      border: isMe ? 'none' : roleBadge.border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.75rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                      textTransform: 'uppercase'
                    }}>
                      {(msg.sender_name || 'A').charAt(0)}
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}>
                      {/* Sender Name & Role Label */}
                      <span style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', color: '#475569' }}>{msg.sender_name}</span>
                        <span style={{ 
                          fontSize: '0.6rem', 
                          background: roleBadge.background, 
                          color: roleBadge.color, 
                          border: roleBadge.border,
                          padding: '0.05rem 0.35rem', 
                          borderRadius: '4px', 
                          textTransform: 'capitalize',
                          fontWeight: '700'
                        }}>
                          {msg.sender_role}
                        </span>
                      </span>
                      
                      {/* Message Bubble */}
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: isMe ? '12px 0px 12px 12px' : '0px 12px 12px 12px',
                        background: isMe ? 'linear-gradient(135deg, var(--primary-emerald), #047857)' : '#ffffff',
                        color: isMe ? 'white' : '#1e293b',
                        fontSize: '0.875rem',
                        lineHeight: '1.45',
                        boxShadow: '0 3px 12px rgba(15, 23, 42, 0.03)',
                        border: isMe ? 'none' : '1px solid #e2e8f0',
                        wordBreak: 'break-word',
                      }}>
                        {msg.message}
                      </div>

                      {/* Msg Timestamp */}
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', padding: '0 0.25rem' }}>
                        {formatTime(msg.created_at)}
                      </span>
                    </div>

                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Area */}
          <form onSubmit={handleSendMessage} style={{
            padding: '1.25rem',
            background: 'white',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={connected ? "Type your message..." : "Disconnected from servers..."}
              disabled={!connected}
              style={{
                flex: 1,
                padding: '0.8rem 1.1rem',
                borderRadius: '999px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: '0.875rem',
                transition: 'border 0.2s',
                background: connected ? '#f8fafc' : '#f1f5f9',
                color: '#1e293b',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--primary-emerald)'}
              onBlur={(e) => e.target.style.border = '1px solid #e2e8f0'}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !connected || sending}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: connected && newMessage.trim() ? 'var(--primary-emerald)' : '#f1f5f9',
                color: connected && newMessage.trim() ? 'white' : '#94a3b8',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: connected && newMessage.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: connected && newMessage.trim() ? '0 4px 12px rgba(4,120,87,0.2)' : 'none'
              }}
            >
              {sending ? <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
            </button>
          </form>

        </div>
      )}

      {/* Embedded Animations and Custom Scrollbar Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes panelSlideUp {
          from { transform: translateY(25px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .chat-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 99px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

    </div>
  );
}
