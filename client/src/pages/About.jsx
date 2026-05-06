import React from 'react';

const About = ({ lang }) => {
    return (
        <div style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 78px)', padding: '80px 5%' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--navy)', marginBottom: '24px' }}>
                    About Government Scheme Portal
                </h1>
                
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '40px' }}>
                    Welcome to the unified gateway for discovering and applying to government welfare programs. 
                    Our mission is to bridge the gap between policy and people through technology, 
                    ensuring that every eligible citizen has seamless access to the benefits they deserve.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div style={{ backgroundColor: 'var(--gray-50)', padding: '32px', borderRadius: '16px' }}>
                        <h3 style={{ color: 'var(--navy)', marginBottom: '16px' }}>Our Vision</h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            To create a digital ecosystem where information about government schemes is accessible, 
                            transparent, and equitable for all citizens regardless of their location or background.
                        </p>
                    </div>
                    <div style={{ backgroundColor: 'var(--gray-50)', padding: '32px', borderRadius: '16px' }}>
                        <h3 style={{ color: 'var(--navy)', marginBottom: '16px' }}>Empowering Citizens</h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            By leveraging AI and real-time data tracking, we reduce the complexity of bureaucratic 
                            processes and empower individuals to take control of their welfare journey.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '60px', padding: '40px', border: '1px solid var(--gray-100)', borderRadius: '16px' }}>
                    <h3 style={{ color: 'var(--navy)', marginBottom: '20px' }}>Frequently Asked Questions</h3>
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Is this portal free to use?</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Yes, all services provided on this portal are free for all Indian citizens.</p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>How secure is my data?</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>We use industry-standard encryption and follow state-of-the-art security protocols to protect your personal information.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
