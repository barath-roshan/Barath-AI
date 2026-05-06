import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ lang }) => {
    return (
        <footer className="footer-main">
            <div className="tricolor-strip-container" style={{ position: 'relative', top: '0', height: '6px' }}>
                <div className="strip-section strip-orange"></div>
                <div className="strip-section strip-white"></div>
                <div className="strip-section strip-green"></div>
            </div>

            <div className="footer-grid">
                <div className="footer-col">
                    <h4 style={{ color: 'white', fontWeight: '800', fontSize: '20px' }}>Government Scheme Portal</h4>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '16px' }}>
                        Providing citizens with easy access to information and application procedures for various welfare schemes.
                    </p>
                    <div className="social-links" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        {/* Placeholder for SVG icons */}
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}></div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}></div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}></div>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/schemes">All Schemes</Link></li>
                        <li><Link to="/track">Track Status</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Other Portals</h4>
                    <ul className="footer-links">
                        <li><a href="https://www.digilocker.gov.in" target="_blank" rel="noreferrer">DigiLocker</a></li>
                        <li><a href="https://www.umang.gov.in" target="_blank" rel="noreferrer">UMANG</a></li>
                        <li><a href="https://jansamarth.in" target="_blank" rel="noreferrer">Jan Samarth</a></li>
                        <li><a href="https://data.gov.in" target="_blank" rel="noreferrer">Data.gov.in</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Contact Us</h4>
                    <p style={{ fontSize: '14px', marginBottom: '12px' }}>Helpline: 1800-111-555</p>
                    <p style={{ fontSize: '14px', marginBottom: '12px' }}>Email: support-schemes@nic.in</p>
                    <p style={{ fontSize: '14px' }}>New Delhi, India</p>
                </div>
            </div>

            <div className="footer-bottom">
                <div>© 2025 Ministry of Electronics & Information Technology</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Accessibility</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
