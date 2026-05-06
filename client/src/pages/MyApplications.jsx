import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MyApplications = ({ lang }) => {
    const { user } = useAuth();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        api.get('/applications/my')
            .then(res => {
                setApps(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const stats = [
        { label: 'Total Applied', count: apps.length, color: 'var(--navy)' },
        { label: 'Under Review', count: apps.filter(a => a.status === 'Submitted').length, color: 'var(--saffron)' },
        { label: 'Approved', count: apps.filter(a => a.status === 'Approved').length, color: 'var(--green)' },
        { label: 'Rejected', count: apps.filter(a => a.status === 'Rejected').length, color: 'red' }
    ];

    if (loading) return <div className="section-common" style={{ textAlign: 'center' }}>Loading your dashboard...</div>;

    return (
        <div className="main-container" style={{ padding: '40px 5%' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' }}>
                    {user?.name[0]}
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--navy)' }}>Welcome back, {user?.name}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{user?.email} · Profile Verified</p>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '50px' }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-card)', borderBottom: `4px solid ${s.color}` }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>{s.label}</div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--navy)', marginTop: '8px' }}>{s.count}</div>
                    </div>
                ))}
            </div>

            {/* Application List */}
            <h3 style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--navy)' }}>Recent Applications</h3>
            
            {apps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px' }}>
                    <p>No applications found. Explore schemes and apply to get started.</p>
                    <a href="/schemes" className="btn-hero-apply" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>Browse Schemes</a>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {apps.map(app => (
                        <div key={app._id} style={{ display: 'flex', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
                            <div style={{ width: '6px', backgroundColor: app.status === 'Approved' ? 'var(--green)' : app.status === 'Rejected' ? 'red' : 'var(--saffron)' }}></div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', width: '100%' }}>
                                <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--gray-50)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                    🏛️
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)' }}>{app.schemeName}</h4>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        Application ID: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{app.applicationNumber}</span>
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        Applied on {new Date(app.submittedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ 
                                        display: 'inline-block', 
                                        padding: '4px 12px', 
                                        borderRadius: '20px', 
                                        fontSize: '11px', 
                                        fontWeight: '700', 
                                        backgroundColor: app.status === 'Approved' ? '#DCFCE7' : app.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                                        color: app.status === 'Approved' ? '#166534' : app.status === 'Rejected' ? '#991B1B' : '#92400E',
                                        marginBottom: '12px'
                                    }}>
                                        {app.status.toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            style={{ color: 'var(--navy)', fontSize: '14px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >View Details</button>
                                        <a href={`/track?id=${app.applicationNumber}`} className="btn-card-apply" style={{ textDecoration: 'none' }}>Track</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {selectedApp && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', maxWidth: '600px', width: '90%', position: 'relative' }}>
                        <button style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }} onClick={() => setSelectedApp(null)}>&times;</button>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--navy)', marginBottom: '30px' }}>Application Tracking</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative', paddingLeft: '30px' }}>
                            <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--gray-100)' }}></div>
                            
                            {[
                                { status: 'Submitted', label: 'Application Submitted', desc: `Received on ${new Date(selectedApp.submittedAt).toLocaleDateString()}`, completed: true },
                                { status: 'Under Review', label: 'Document Verification', desc: 'Agency is verifying your documents', completed: selectedApp.status !== 'Submitted' },
                                { status: 'Approved', label: 'Final Decision', desc: selectedApp.status === 'Approved' ? 'Application Approved' : 'Awaiting Decision', completed: selectedApp.status === 'Approved' }
                            ].map((step, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <div style={{ 
                                        position: 'absolute', left: '-27px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', 
                                        backgroundColor: step.completed ? 'var(--green)' : 'var(--gray-400)',
                                        boxShadow: step.status === selectedApp.status ? '0 0 0 4px rgba(26,35,126,0.1)' : 'none'
                                    }}></div>
                                    <div style={{ fontWeight: '700', fontSize: '15px', color: step.completed ? 'var(--navy)' : 'var(--text-muted)' }}>{step.label}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{step.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplications;
