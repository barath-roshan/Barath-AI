import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const statesList = [
    { en: 'Tamil Nadu', ta: 'தமிழ்நாடு' },
    { en: 'Kerala', ta: 'கேரளா' },
    { en: 'Karnataka', ta: 'கர்நாடகா' },
    { en: 'Andhra Pradesh', ta: 'ஆந்திரப் பிரதேசம்' },
    { en: 'Delhi', ta: 'டெல்லி' }
];

const categoriesList = [
    { id: 'General', en: 'General / பொது', ta: 'பொது' },
    { id: 'OBC', en: 'OBC / ஓபிசி', ta: 'ஓபிசி' },
    { id: 'SC', en: 'SC / தலித்', ta: 'தலித்' },
    { id: 'ST', en: 'ST / பழங்குடி', ta: 'பழங்குடி' },
    { id: 'EWS', en: 'EWS / இ.டபிள்யூ.எஸ்', ta: 'இ.டபிள்யூ.எஸ்' }
];

const Register = ({ lang }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', aadhaar: '',
        password: '', confirmPassword: '', dateOfBirth: '',
        state: 'Tamil Nadu', category: 'General'
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match / கடவுச்சொற்கள் பொருந்தவில்லை');
        }
        if (formData.aadhaar.length !== 12) {
            return setError('Aadhaar must be 12 digits / ஆதார் 12 இலக்கங்களாக இருக்க வேண்டும்');
        }
        if (formData.phone.length !== 10) {
            return setError('Phone must be 10 digits / தொலைபேசி 10 இலக்கங்களாக இருக்க வேண்டும்');
        }

        try {
            const res = await api.post('/auth/register', formData);
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Server error / சர்வர் பிழை');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 78px)', backgroundColor: 'white' }}>
            {/* Left Panel */}
            <div style={{ width: '40%', backgroundColor: 'var(--navy)', color: 'white', padding: '60px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, width: '150%' }}>
                    <svg viewBox="0 0 100 100" style={{ animation: 'spin 60s linear infinite' }}>
                        <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="1" fill="none" />
                        {[...Array(24)].map((_, i) => (
                            <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(i * 15 * Math.PI / 180)} y2={50 + 40 * Math.sin(i * 15 * Math.PI / 180)} stroke="white" strokeWidth="0.5" />
                        ))}
                    </svg>
                </div>
                
                <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', position: 'relative' }}>
                    Join the Digital Transformation
                </h2>
                <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '18px', position: 'relative' }}>
                    Register today to find and apply for over 1,200+ benefits tailored just for you.
                </p>
                
                <div style={{ marginTop: '60px', position: 'relative' }}>
                    {[
                        'Hassle-free Online Applications',
                        'Real-time Tracking Updates',
                        'Direct Benefit Transfer (DBT)',
                        'Secure Document Storage'
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '15px' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--saffron)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div style={{ width: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--navy)', marginBottom: '8px' }}>Register</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        Create your citizen profile to start applying.
                    </p>

                    {error && <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="floating-input-group">
                            <input 
                                type="text" className="floating-input" placeholder=" " required
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <label className="floating-label">Full Name / முழு பெயர்</label>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="floating-input-group">
                                <input 
                                    type="email" className="floating-input" placeholder=" " required
                                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                                <label className="floating-label">Email Address</label>
                            </div>
                            <div className="floating-input-group">
                                <input 
                                    type="tel" className="floating-input" placeholder=" " required maxLength="10"
                                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                                <label className="floating-label">Phone Number</label>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="floating-input-group">
                                <input 
                                    type="text" className="floating-input" placeholder=" " required maxLength="12"
                                    value={formData.aadhaar} onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                                />
                                <label className="floating-label">Aadhaar (12 digits)</label>
                            </div>
                            <div className="floating-input-group">
                                <input 
                                    type="date" className="floating-input" placeholder=" " required
                                    value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                />
                                <label className="floating-label">Date of Birth</label>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="floating-input-group">
                                <select 
                                    className="floating-input" value={formData.state} 
                                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                                >
                                    {statesList.map(s => <option key={s.en} value={s.en}>{s.en}</option>)}
                                </select>
                                <label className="floating-label">State</label>
                            </div>
                            <div className="floating-input-group">
                                <select 
                                    className="floating-input" value={formData.category} 
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    {categoriesList.map(c => <option key={c.id} value={c.id}>{c.en}</option>)}
                                </select>
                                <label className="floating-label">Category</label>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="floating-input-group">
                                <input 
                                    type="password" className="floating-input" placeholder=" " required minLength="8"
                                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                                <label className="floating-label">Password</label>
                            </div>
                            <div className="floating-input-group">
                                <input 
                                    type="password" className="floating-input" placeholder=" " required
                                    value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                                <label className="floating-label">Confirm Password</label>
                            </div>
                        </div>

                        <button type="submit" className="btn-hero-apply" style={{ width: '100%', borderRadius: '8px', height: '52px', fontSize: '16px', marginTop: '20px' }}>
                            Create Account / பதிவு
                        </button>

                        <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            Already have an account? {' '}
                            <Link to="/login" style={{ color: 'var(--navy)', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
