import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const SchemeDetail = ({ lang, handleApplyClick }) => {
    const { id } = useParams();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        api.get(`/schemes/${id}`)
            .then(res => {
                setScheme(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="section-common" style={{ textAlign: 'center' }}>Loading Scheme Details...</div>;
    if (!scheme) return <div className="section-common" style={{ textAlign: 'center' }}>Scheme not found.</div>;

    const tabs = [
        { id: 'overview', en: 'Overview', ta: 'மேலோட்டம்' },
        { id: 'eligibility', en: 'Eligibility', ta: 'தகுதி' },
        { id: 'benefits', en: 'Benefits', ta: 'பலன்கள்' },
        { id: 'documents', en: 'Documents Required', ta: 'தேவையான ஆவணங்கள்' }
    ];

    return (
        <div className="scheme-detail-page">
            <div 
                className="detail-hero" 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(10,20,80,0.8), rgba(10,20,80,0.6)), url(https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80)`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 5%'
                }}
            >
                <div style={{ color: 'white' }}>
                    <div className="ministry-tag">{lang === 'en' ? scheme.ministryEn : scheme.ministryTa}</div>
                    <h1 style={{ fontSize: '40px', fontWeight: '800', margin: '12px 0' }}>{lang === 'en' ? scheme.nameEn : scheme.nameTa}</h1>
                    <p style={{ fontSize: '20px', color: '#90CAF9' }}>{scheme.nameTa}</p>
                </div>
            </div>

            <div className="main-container" style={{ display: 'flex', gap: '40px', padding: '60px 5%' }}>
                <div style={{ flex: '1' }}>
                    <div className="tab-nav" style={{ justifyContent: 'flex-start' }}>
                        {tabs.map(tab => (
                            <div 
                                key={tab.id} 
                                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {lang === 'en' ? tab.en : tab.ta}
                            </div>
                        ))}
                    </div>

                    <div className="tab-content-detail" style={{ padding: '30px 0', fontSize: '16px', lineHeight: '1.8' }}>
                        {activeTab === 'overview' && (
                            <div>
                                <p>{lang === 'en' ? scheme.benefitDescEn : scheme.benefitDescTa}</p>
                                <h3 style={{ marginTop: '24px', color: 'var(--navy)' }}>About the Scheme</h3>
                                <p>Launched by the {scheme.ministryEn}, this initiative aims to provide comprehensive support to eligible citizens across India.</p>
                            </div>
                        )}
                        {activeTab === 'eligibility' && (
                            <div>
                                <h3 style={{ color: 'var(--navy)' }}>Who can apply?</h3>
                                <ul style={{ marginLeft: '20px', marginTop: '16px' }}>
                                    <li>Indian Citizen</li>
                                    <li>Age between 18 and 60 years</li>
                                    <li>Annual family income criteria as per category</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'benefits' && (
                            <div>
                                <h3 style={{ color: 'var(--navy)' }}>Key Benefits</h3>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--saffron)', margin: '16px 0' }}>
                                    {lang === 'en' ? scheme.benefitEn : scheme.benefitTa}
                                </div>
                                <p>Detailed monetary or service-based benefits as defined under the central guidelines.</p>
                            </div>
                        )}
                        {activeTab === 'documents' && (
                            <div>
                                <h3 style={{ color: 'var(--navy)' }}>Required Documents</h3>
                                <ul style={{ marginLeft: '20px', marginTop: '16px' }}>
                                    <li>Aadhaar Card copy</li>
                                    <li>Income Certificate</li>
                                    <li>Residence Proof (Ration card / Voter ID)</li>
                                    <li>Bank Account Details</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ width: '350px' }}>
                    <div className="sticky-apply-card" style={{ position: 'sticky', top: '100px', backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: 'var(--shadow-hover)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Benefit Amount</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--saffron)', margin: '8px 0 24px' }}>
                            {lang === 'en' ? scheme.benefitEn : scheme.benefitTa}
                        </div>
                        
                        <button className="btn-hero-apply" style={{ width: '100%', borderRadius: '8px' }} onClick={() => handleApplyClick(scheme)}>
                            Apply Now
                        </button>
                        
                        <div style={{ marginTop: '24px', borderTop: '1px solid var(--gray-100)', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '14px' }}>
                                <span style={{ color: 'var(--green)' }}>●</span> {lang === 'en' ? 'Online Application' : 'ஆன்லைன் விண்ணப்பம்'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                                <span style={{ color: 'var(--green)' }}>●</span> {lang === 'en' ? 'Direct Benefit Transfer' : 'நேரடி பலன் பரிமாற்றம்'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemeDetail;
