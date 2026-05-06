import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = ({ lang }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.token, res.data.user);
            navigate(redirectPath);
        } catch (err) {
            setError(err.response?.data?.message || 'Server error / சர்வர் பிழை');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 78px)', backgroundColor: 'white' }}>
            {/* Left Panel */}
            <div style={{ width: '45%', backgroundColor: 'var(--navy)', color: 'white', padding: '80px 60px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, width: '150%' }}>
                    <svg viewBox="0 0 100 100" style={{ animation: 'spin 60s linear infinite' }}>
                        <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="1" fill="none" />
                        {[...Array(24)].map((_, i) => (
                            <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(i * 15 * Math.PI / 180)} y2={50 + 40 * Math.sin(i * 15 * Math.PI / 180)} stroke="white" strokeWidth="0.5" />
                        ))}
                    </svg>
                </div>
                
                <h2 style={{ fontSize: '40px', fontWeight: '800', lineHeight: '1.2', position: 'relative' }}>
                    Access Benefits for a Better Tomorrow
                </h2>
                <div style={{ marginTop: '40px', position: 'relative' }}>
                    {[
                        { count: '1,200+', label: 'Government Schemes' },
                        { count: '14.5 Cr+', label: 'Registered Beneficiaries' },
                        { count: '100%', label: 'Direct Benefit Transfer' }
                    ].map((stat, i) => (
                        <div key={i} style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--saffron-light)' }}>{stat.count}</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div style={{ width: '55%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--navy)', marginBottom: '8px' }}>Login</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        Enter your credentials to access your dashboard.
                    </p>

                    {error && <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="floating-input-group">
                            <input 
                                type="email" 
                                className="floating-input" 
                                placeholder=" "
                                required 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <label className="floating-label">Email / மின்னஞ்சல்</label>
                        </div>

                        <div className="floating-input-group" style={{ marginBottom: '12px' }}>
                            <input 
                                type="password" 
                                className="floating-input" 
                                placeholder=" "
                                required 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <label className="floating-label">Password / கடவுச்சொல்</label>
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '32px' }}>
                            <Link to="#" style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: '600', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>

                        <button type="submit" className="btn-hero-apply" style={{ width: '100%', borderRadius: '8px', height: '52px', fontSize: '16px' }}>
                            Sign In / உள்நுழை
                        </button>

                        <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            Don't have an account? {' '}
                            <Link to="/register" style={{ color: 'var(--saffron)', fontWeight: '700', textDecoration: 'none' }}>Register Now</Link>
                        </p>
                    </form>
                    
                    <div style={{ marginTop: '60px', borderTop: '1px solid var(--gray-100)', paddingTop: '24px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Secured by Government of India · DigiLocker Verified
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
