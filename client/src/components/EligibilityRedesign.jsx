import React from 'react';

const EligibilityRedesign = ({ lang, formData, onChange, onSubmit }) => {
    return (
        <section className="section-common bg-light">
            <div className="checker-split">
                <div className="checker-left">
                    <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2' }}>
                        {lang === 'en' ? 'Find Your Eligible Schemes' : 'தகுதியுள்ள திட்டங்களை கண்டறியுங்கள்'}
                    </h2>
                    <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
                        Barath AI helps you identify the perfect schemes based on your profile in seconds.
                    </p>
                    <ul style={{ marginTop: '40px', listStyle: 'none' }}>
                        {[
                            { en: '1,200+ Schemes integrated', ta: '1200+ திட்டங்கள் இணைக்கப்பட்டுள்ளன' },
                            { en: 'Simple 3-step process', ta: 'எளிய 3-படி செயல்முறை' },
                            { en: 'Secure & confidential', ta: 'பாதுகாப்பானது' }
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--saffron)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                                <span>{lang === 'en' ? item.en : item.ta}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="checker-right">
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                        <div className="category-group" style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                                Personal Profile
                            </label>
                            
                            <div className="floating-input-group">
                                <select 
                                    className="floating-input"
                                    name="state"
                                    value={formData.state}
                                    onChange={onChange}
                                    required
                                >
                                    <option value="">Select State</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                </select>
                                <label className="floating-label">State / மாநிலம்</label>
                            </div>

                            <div className="floating-input-group">
                                <select 
                                    className="floating-input"
                                    name="category"
                                    value={formData.category}
                                    onChange={onChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="General">General</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                </select>
                                <label className="floating-label">Category / வகை</label>
                            </div>

                            <div className="floating-input-group">
                                <select 
                                    className="floating-input"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={onChange}
                                    required
                                >
                                    <option value="">Select Occupation</option>
                                    <option value="Student">Student</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Unemployed">Unemployed</option>
                                    <option value="Self-Employed">Self-Employed</option>
                                </select>
                                <label className="floating-label">Occupation / தொழில்</label>
                            </div>

                            <div className="floating-input-group" style={{ marginBottom: '0' }}>
                                <select 
                                    className="floating-input"
                                    name="income"
                                    value={formData.income}
                                    onChange={onChange}
                                    required
                                >
                                    <option value="">Select Annual Income</option>
                                    <option value="low">Below ₹1,00,000</option>
                                    <option value="mid">₹1,00,000 - ₹5,00,000</option>
                                    <option value="high">Above ₹5,00,000</option>
                                </select>
                                <label className="floating-label">Annual Income / ஆண்டு வருமானம்</label>
                            </div>
                        </div>

                        <button type="submit" className="btn-hero-apply" style={{ width: '100%', borderRadius: '8px' }}>
                            {lang === 'en' ? 'Check Eligibility / சரிபார்க்கவும்' : 'தகுதி சரிபார்க்கவும் / Check Eligibility'}
                        </button>
                    </form>
                </div>
            </div>
            
            <style>{`
                .floating-input-group select {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 16px center;
                    background-size: 16px;
                }
            `}</style>
        </section>
    );
};

export default EligibilityRedesign;
