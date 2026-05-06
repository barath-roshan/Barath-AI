import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from './api/axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Shared Components
import Navbar from './components/Navbar';
import TricolorStrip from './components/TricolorStrip';
import Footer from './components/Footer';
import BarathChat from './components/BarathChat';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyApplications from './pages/MyApplications';
import AllSchemes from './pages/AllSchemes';
import SchemeDetail from './pages/SchemeDetail';
import TrackStatus from './pages/TrackStatus';
import About from './pages/About';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './AdminProtectedRoute';

// Modals
const EligibilityModal = ({ lang, scheme, onNext, onClose }) => {
    const { user } = useAuth();
    const [answers, setAnswers] = useState({
        age: '',
        gender: user?.gender || '',
        income: ''
    });

    const handleCheck = () => {
        const { eligibility } = scheme;
        if (!eligibility) return onNext(); // Fallback if no eligibility defined

        const age = parseInt(answers.age);
        const income = parseInt(answers.income);

        if (!age || !answers.gender || !income) {
            alert(lang === 'en' ? 'Please fill all fields' : 'அனைத்து துறைகளையும் நிரப்பவும்');
            return;
        }

        // Check age
        if (age < eligibility.ageMin || age > eligibility.ageMax) {
            alert(lang === 'en' ? `Age must be between ${eligibility.ageMin} and ${eligibility.ageMax}` : `வயது ${eligibility.ageMin} மற்றும் ${eligibility.ageMax} க்குள் இருக்க வேண்டும்`);
            return;
        }

        // Check gender
        if (eligibility.gender !== 'All' && answers.gender !== eligibility.gender) {
            alert(lang === 'en' ? `This scheme is only for ${eligibility.gender}` : `இந்தத் திட்டம் ${eligibility.gender} களுக்கு மட்டுமே`);
            return;
        }

        // Check income
        if (income > eligibility.incomeMax) {
            alert(lang === 'en' ? `Annual income must be below ₹${eligibility.incomeMax}` : `ஆண்டு வருமானம் ₹${eligibility.incomeMax} க்கு குறைவாக இருக்க வேண்டும்`);
            return;
        }

        onNext();
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', maxWidth: '500px', width: '90%', position: 'relative' }}>
                <button style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }} onClick={onClose}>&times;</button>
                <h3>{lang === 'en' ? 'Enhanced Eligibility Check' : 'மேம்படுத்தப்பட்ட தகுதி சரிபார்ப்பு'}</h3>
                
                <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>{lang === 'en' ? 'Age' : 'வயது'}</label>
                    <input type="number" style={{ width: '100%', padding: '10px' }} value={answers.age} onChange={e => setAnswers({...answers, age: e.target.value})} />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>{lang === 'en' ? 'Gender' : 'பாலினம்'}</label>
                    <select style={{ width: '100%', padding: '10px' }} value={answers.gender} onChange={e => setAnswers({...answers, gender: e.target.value})}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                    </select>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>{lang === 'en' ? 'Annual Income' : 'ஆண்டு வருமானம்'}</label>
                    <input type="number" style={{ width: '100%', padding: '10px' }} value={answers.income} onChange={e => setAnswers({...answers, income: e.target.value})} />
                </div>

                <button onClick={handleCheck} className="btn-hero-apply" style={{ width: '100%', marginTop: '30px' }}>{lang === 'en' ? 'Verify & Proceed' : 'சரிபார்த்து தொடரவும்'}</button>
            </div>
        </div>
    );
};

const ApplicationForm = ({ lang, scheme, onSubmit, onClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ address: '', income: '' });

    return (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', maxWidth: '600px', width: '90%', position: 'relative' }}>
                <button style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }} onClick={onClose}>&times;</button>
                <h3>{lang === 'en' ? 'Application Form' : 'விண்ணப்பப் படிவம்'}</h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
                        <input required type="text" style={{ width: '100%', padding: '10px' }} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Annual Income</label>
                        <input required type="number" style={{ width: '100%', padding: '10px' }} value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-hero-apply" style={{ width: '100%' }}>Submit Application</button>
                </form>
            </div>
        </div>
    );
};

function AppContent() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [lang, setLang] = useState('en');
    const [schemes, setSchemes] = useState([]);
    const [eligibility, setEligibility] = useState({ state: '', category: '', income: '', occupation: '' });

    // Application Flow State
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalStage, setModalStage] = useState('eligibility');

    useEffect(() => {
        api.get('/schemes').then(res => setSchemes(res.data)).catch(err => console.error(err));
    }, []);

    const handleApplyClick = (scheme) => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=/?apply=${scheme._id}`);
            return;
        }
        setSelectedScheme(scheme);
        setModalStage('eligibility');
        setShowModal(true);
    };

    const handleApplicationSubmit = async (formData) => {
        try {
            await api.post('/applications', {
                schemeId: selectedScheme._id,
                schemeName: selectedScheme.nameEn || selectedScheme.titleEn,
                ...formData
            });
            alert('Submitted Successfully!');
            setShowModal(false);
        } catch (err) {
            alert('Submission failed');
        }
    };

    return (
        <>
            <Navbar lang={lang} setLanguage={setLang} />
            <TricolorStrip />
            
            <Routes>
                <Route path="/" element={
                    <Home 
                        lang={lang} 
                        schemes={schemes} 
                        eligibility={eligibility} 
                        handleEligChange={(e) => setEligibility({...eligibility, [e.target.name]: e.target.value})}
                        checkEligibility={() => navigate('/schemes')}
                        handleApplyClick={handleApplyClick}
                    />
                } />
                <Route path="/login" element={<Login lang={lang} />} />
                <Route path="/register" element={<Register lang={lang} />} />
                <Route path="/schemes" element={<AllSchemes lang={lang} schemes={schemes} handleApplyClick={handleApplyClick} />} />
                <Route path="/schemes/:id" element={<SchemeDetail lang={lang} handleApplyClick={handleApplyClick} />} />
                <Route path="/applications" element={<ProtectedRoute><MyApplications lang={lang} /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard lang={lang} /></AdminProtectedRoute>} />
                <Route path="/track" element={<TrackStatus lang={lang} />} />
                <Route path="/about" element={<About lang={lang} />} />
                <Route path="*" element={<Home lang={lang} schemes={schemes} eligibility={eligibility} handleEligChange={(e) => setEligibility({...eligibility, [e.target.name]: e.target.value})} checkEligibility={() => navigate('/schemes')} handleApplyClick={handleApplyClick} />} />
            </Routes>

            {showModal && modalStage === 'eligibility' && (
                <EligibilityModal lang={lang} scheme={selectedScheme} onNext={() => setModalStage('form')} onClose={() => setShowModal(false)} />
            )}
            {showModal && modalStage === 'form' && (
                <ApplicationForm lang={lang} scheme={selectedScheme} onSubmit={handleApplicationSubmit} onClose={() => setShowModal(false)} />
            )}

            <BarathChat lang={lang} />
            <Footer lang={lang} />
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
