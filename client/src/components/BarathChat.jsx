import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BarathChat = ({ lang }) => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { 
            role: 'barath', 
            text: "வணக்கம்! Hello! I'm Barath, your Government Scheme Assistant. I can help you find schemes you qualify for or track your application. What would you like to do?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [suggestions, setSuggestions] = useState(["Find schemes for me", "Track my application", "Explain a scheme"]);
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const handleOpen = () => {
        setIsOpen(true);
        setUnreadCount(0);
    };

    const handleSend = async (text) => {
        const userMsg = text || message;
        if (!userMsg.trim()) return;

        const newMsg = {
            role: 'user',
            text: userMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMsg]);
        setMessage('');
        setSuggestions([]);
        
        // Fast-path handling
        if (userMsg === "Track my application") {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'barath',
                    text: "Sure! Please enter your Application Number (format: APP-2025-123456) and I'll check its status for you.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                setSuggestions(["I don't have it", "Go to Track page"]);
            }, 600);
            return;
        }

        setIsTyping(true);
        try {
            const res = await api.post('/chatbot/message', {
                message: userMsg,
                userId: user?._id,
                conversationHistory: messages
            });

            const barathReply = {
                role: 'barath',
                text: res.data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, barathReply]);
            setSuggestions(res.data.suggestions || []);
            
            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
            }

        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'barath',
                text: "மன்னிக்கவும்! Sorry, I'm having trouble connecting right now. Please try again in a moment.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button 
                    onClick={handleOpen}
                    className="barath-float-btn"
                    style={{
                        position: 'fixed', bottom: '30px', right: '30px',
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: 'var(--navy)', color: 'white',
                        border: 'none', cursor: 'pointer', zIndex: 9999,
                        boxShadow: '0 8px 32px rgba(26, 35, 126, 0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'var(--transition)'
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    
                    <div className="saffron-dot-container" style={{ position: 'absolute', top: '2px', right: '2px', width: '14px', height: '14px' }}>
                        <div className="pulse-ring ring-1"></div>
                        <div className="pulse-ring ring-2"></div>
                        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--saffron)', border: '2px solid white', zIndex: 2 }}></div>
                    </div>
                </button>
            )}

            <div className={`barath-panel ${isOpen ? 'open' : ''}`} style={{
                position: 'fixed', top: 0, right: 0,
                width: '400px', height: '100vh', backgroundColor: 'white',
                zIndex: 10000, boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{
                    padding: '30px 24px', 
                    background: 'var(--navy)', 
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            backgroundColor: 'var(--saffron)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', 
                            fontWeight: '800', fontSize: '22px',
                            boxShadow: '0 4px 12px rgba(255,111,0,0.4)'
                        }}>B</div>
                        <div>
                            <div style={{fontWeight: '800', fontSize: '20px', letterSpacing: '0.5px'}}>Barath AI</div>
                            <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase'}}>Gov Scheme Assistant</div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '28px'}}>&times;</button>
                </div>

                <div 
                    ref={scrollRef}
                    style={{
                        flex: 1, overflowY: 'auto', padding: '30px 24px',
                        backgroundColor: 'var(--off-white)', display: 'flex', flexDirection: 'column', gap: '20px'
                    }}
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%'
                        }}>
                            <div style={{
                                padding: '16px 20px', borderRadius: '16px',
                                backgroundColor: msg.role === 'user' ? 'var(--navy)' : 'white',
                                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                fontSize: '15px', lineHeight: '1.5',
                                boxShadow: 'var(--shadow-card)',
                                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px'
                            }}>
                                {msg.text}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div style={{alignSelf: 'flex-start', display: 'flex', gap: '6px', padding: '16px 24px', backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)'}}>
                            <div className="typing-dot" style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--navy)'}}></div>
                            <div className="typing-dot" style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--navy)', animationDelay: '0.2s'}}></div>
                            <div className="typing-dot" style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--navy)', animationDelay: '0.4s'}}></div>
                        </div>
                    )}
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid var(--gray-100)', backgroundColor: 'white' }}>
                    {suggestions.length > 0 && (
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px'}}>
                            {suggestions.map((s, idx) => (
                                <button 
                                    key={idx} onClick={() => handleSend(s)}
                                    className="suggestion-chip"
                                    style={{
                                        padding: '10px 18px', borderRadius: '30px',
                                        border: '1px solid var(--navy-light)', color: 'var(--navy)',
                                        backgroundColor: 'white', fontSize: '13px',
                                        fontWeight: '700', cursor: 'pointer', transition: 'var(--transition)'
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                        <input 
                            type="text" placeholder="Type your question..."
                            value={message} onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--gray-100)', outline: 'none', backgroundColor: 'var(--gray-50)', fontSize: '15px' }}
                        />
                        <button 
                            onClick={() => handleSend()}
                            style={{ backgroundColor: 'var(--saffron)', color: 'white', border: 'none', borderRadius: '12px', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,111,0,0.3)' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};


export default BarathChat;
