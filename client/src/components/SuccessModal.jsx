import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ data, onClose }) => {
  const navigate = useNavigate();

  const handlePrint = () => {
    const html = `
      <html>
      <head>
        <title>Application Acknowledgment - ${data.applicationNumber}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #0F172A; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px solid #1A237E; padding-bottom: 20px; margin-bottom: 30px; }
          .emblem { font-size: 40px; margin-bottom: 10px; }
          h1 { color: #1A237E; font-size: 24px; margin: 0; }
          h2 { font-size: 18px; color: #475569; margin-top: 5px; }
          .app-number-box { text-align: center; background: #f8fafc; padding: 30px; border-radius: 12px; margin: 30px 0; border: 1px solid #e2e8f0; }
          .app-number { font-size: 32px; font-weight: 800; color: #FF6F00; font-family: monospace; letter-spacing: 2px; }
          .status-badge { display: inline-block; background: #DBEAFE; color: #1D4ED8; padding: 6px 16px; border-radius: 6px; font-weight: 700; text-transform: uppercase; margin-top: 10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
          .info-item { border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
          .label { font-size: 12px; color: #94A3B8; text-transform: uppercase; font-weight: 700; }
          .value { font-size: 16px; font-weight: 600; color: #1e293b; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 20px; }
          @media print { .no-print { display: none; } }
          .btn-print { background: #1A237E; color: white; border: none; padding: 12px 24px; borderRadius: 8px; font-weight: 700; cursor: pointer; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="emblem">⊕</div>
          <h1>Government of India · இந்திய அரசு</h1>
          <h2>Application Acknowledgment / விண்ணப்ப ஒப்புகை</h2>
        </div>
        
        <div class="app-number-box">
          <div>Application Reference Number / விண்ணப்ப எண்:</div>
          <div class="app-number">${data.applicationNumber}</div>
          <div class="status-badge">Submitted Successfully</div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="label">Scheme Name</div>
            <div class="value">${data.schemeName || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="label">Submission Date</div>
            <div class="value">${new Date(data.submittedAt).toLocaleString('en-IN')}</div>
          </div>
          <div class="info-item">
            <div class="label">Eligibility Score</div>
            <div class="value">${data.eligibilityScore || 'N/A'}%</div>
          </div>
        </div>

        <div class="footer">
          This is a computer-generated acknowledgment. No signature is required.<br>
          Government Scheme Portal · Ministry of Electronics & Information Technology
        </div>
        <div style="text-align: center;">
            <button class="no-print btn-print" onclick="window.print()">Print / அச்சிடு</button>
        </div>
      </body>
      </html>
    `;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ backgroundColor: 'white', padding: '50px', borderRadius: '32px', maxWidth: '550px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        
        <h2 style={{ color: 'var(--navy)', marginBottom: '10px' }}>Application Submitted!</h2>
        <p style={{ color: '#64748b', fontSize: '16px' }}>விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது</p>
        
        <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '16px', margin: '30px 0', border: '1px dashed #CBD5E1' }}>
          <p style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', marginBottom: '8px' }}>Your Application Number</p>
          <h1 style={{ color: 'var(--saffron)', margin: 0, fontFamily: 'monospace', letterSpacing: '2px' }}>{data.applicationNumber}</h1>
          <button onClick={() => { navigator.clipboard.writeText(data.applicationNumber); alert('Copied!'); }} style={{ background: 'none', border: 'none', color: 'var(--navy)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>Copy to Clipboard 📋</button>
        </div>

        <p style={{ color: '#475569', fontSize: '14px', marginBottom: '30px' }}>Save this number to track your status later. You can also download the acknowledgment PDF below.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={handlePrint} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: 'var(--navy)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
            Download Acknowledgment PDF 📥
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/applications')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', background: 'white', color: 'var(--navy)', fontWeight: '700', cursor: 'pointer' }}>
              Track Status
            </button>
            <button onClick={() => { onClose(); navigate('/schemes'); }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', background: 'white', color: 'var(--navy)', fontWeight: '700', cursor: 'pointer' }}>
              Find More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
