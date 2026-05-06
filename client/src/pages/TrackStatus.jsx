import React, { useState } from 'react';
import api from '../api/axios';

const TrackStatus = ({ lang }) => {
    const [appNumber, setAppNumber] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);
        
        try {
            const res = await api.get(`/applications/track/${appNumber.trim()}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Application not found / விண்ணப்பம் கிடைக்கவில்லை');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--off-white)', minHeight: 'calc(100vh - 78px)', padding: '60px 5%' }}>
            <div className="section-header" style={{ marginBottom: '50px' }}>
                <h2 className="section-title-main" style={{ color: 'var(--navy)' }}>
                    {lang === 'en' ? 'Track Application Status' : 'விண்ணப்பத் தரம்'}
                </h2>
                <p className="section-subtitle-main">
                    Enter your 15-digit Application Reference Number to retrieve current processing status.
                </p>
            </div>

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--gray-100)' }}>
                    <form onSubmit={handleSearch}>
                        <div className="floating-input-group" style={{ marginBottom: '24px' }}>
                            <input 
                                type="text"
                                className="floating-input"
                                placeholder=" "
                                required
                                value={appNumber}
                                onChange={(e) => setAppNumber(e.target.value)}
                            />
                            <label className="floating-label">Application Number (e.g. APP-2025-XXXXXX)</label>
                        </div>
                        
                        <button type="submit" className="btn-hero-apply" disabled={loading} style={{ width: '100%', borderRadius: '12px', height: '54px' }}>
                            {loading ? 'Searching...' : (lang === 'en' ? 'Track Status' : 'நிலையைத் தேடு')}
                        </button>
                    </form>

                    {error && (
                        <div style={{ marginTop: '30px', padding: '16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', textAlign: 'center', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    {result && (
                        <div style={{ marginTop: '40px', borderTop: '1px solid var(--gray-100)', paddingTop: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--navy)' }}>{result.schemeName}</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{result.applicationNumber}</p>
                                </div>
                                <div style={{ 
                                    padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', 
                                    backgroundColor: result.status === 'Approved' ? '#DCFCE7' : result.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                                    color: result.status === 'Approved' ? '#166534' : result.status === 'Rejected' ? '#991B1B' : '#92400E'
                                }}>
                                    {result.status.toUpperCase()}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div style={{ backgroundColor: 'var(--gray-50)', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Submission Date</div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', marginTop: '6px' }}>{new Date(result.submittedAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ backgroundColor: 'var(--gray-50)', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Last Updated</div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', marginTop: '6px' }}>{new Date(result.lastUpdated || result.submittedAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '30px', backgroundColor: 'var(--navy)', color: 'white', padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.6, textTransform: 'uppercase' }}>Processing Office Status</div>
                                    <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                                        {result.remarks || 'Your application is currently at Stage 1 (Initial Screening). Our officers are reviewing the submitted documents for consistency with Aadhaar records.'}
                                    </p>
                                </div>
                                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '60px', opacity: 0.1 }}>🏛️</div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '40px', backgroundColor: '#E3F2FD', padding: '24px', borderRadius: '12px', border: '1px solid #BBDEFB', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ fontSize: '24px' }}>💡</div>
                    <p style={{ fontSize: '14px', color: '#1565C0', lineHeight: '1.5' }}>
                        Didn't receive a message? It usually takes <b>5-7 working days</b> for the initial review to reflect in our systems. For urgent inquiries, please contact the 1800-111-555 helpline.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrackStatus;
