import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ lang, setLanguage }) => {
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header-main ${scrolled ? 'header-scrolled' : ''}`}>
            <div className="header-left">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
                    <svg className="ashoka-chakra-header" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" />
                        <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="1.5" />
                        {[...Array(24)].map((_, i) => (
                            <line 
                                key={i} x1="50" y1="50" 
                                x2={50 + 35 * Math.cos(i * 15 * Math.PI / 180)} 
                                y2={50 + 35 * Math.sin(i * 15 * Math.PI / 180)} 
                                stroke="white" strokeWidth="1" 
                            />
                        ))}
                    </svg>
                    <div className="header-divider"></div>
                    <div>
                        <h1 className="portal-title">Government Scheme Portal</h1>
                        <span className="gov-india-subtitle">Government of India · இந்திய அரசு</span>
                    </div>
                </Link>
            </div>

            <div className="header-right">
                <div className="lang-toggle-pill">
                    <button 
                        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                        onClick={() => setLanguage('en')}
                    >EN</button>
                    <button 
                        className={`lang-btn ${lang === 'ta' ? 'active' : ''}`}
                        onClick={() => setLanguage('ta')}
                    >தமிழ்</button>
                </div>

                {!isAuthenticated ? (
                    <>
                        <button className="btn-login-header" onClick={() => navigate('/login')}>
                            {lang === 'en' ? 'Login' : 'உள்நுழை'}
                        </button>
                        <button className="btn-register-header" onClick={() => navigate('/register')}>
                            {lang === 'en' ? 'Register' : 'பதிவு'}
                        </button>
                    </>
                ) : (
                    <>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="btn-login-header" style={{ textDecoration: 'none', backgroundColor: '#ff9933' }}>
                                Admin
                            </Link>
                        )}
                        <Link to="/applications" className="btn-login-header" style={{ textDecoration: 'none' }}>
                            {lang === 'en' ? 'Dashboard' : 'டாஷ்போர்டு'}
                        </Link>
                        <button className="btn-register-header" onClick={logout}>
                            {lang === 'en' ? 'Logout' : 'வெளியேறு'}
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
