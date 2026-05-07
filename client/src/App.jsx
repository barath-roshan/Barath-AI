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
import MultiStepApplicationForm from './components/MultiStepApplicationForm';
import SuccessModal from './components/SuccessModal';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyApplications from './pages/MyApplications';
import AllSchemes from './pages/AllSchemes';
import SchemeDetail from './pages/SchemeDetail';
import TrackStatus from './pages/TrackStatus';
import About from './pages/About';
import EligibilityWizard from './pages/EligibilityWizard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './AdminProtectedRoute';

function AppContent() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [lang, setLang] = useState('en');
    const [schemes, setSchemes] = useState([]);
    const [eligibility, setEligibility] = useState({ state: '', category: '', income: '', occupation: '' });

    // Application Flow State
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submissionData, setSubmissionData] = useState(null);

    useEffect(() => {
        api.get('/schemes').then(res => setSchemes(res.data)).catch(err => console.error(err));
    }, []);

    const handleApplyClick = (scheme) => {
        // If it's a hero slide (no _id), find the real scheme by title
        let targetScheme = scheme;
        if (!scheme._id) {
            targetScheme = schemes.find(s => 
                s.nameEn.toLowerCase().includes(scheme.titleEn?.split(' ')[0].toLowerCase()) ||
                s.nameEn.toLowerCase().includes(scheme.titleEn?.toLowerCase())
            );
        }

        if (!targetScheme) {
            console.error("Scheme not found in database:", scheme);
            alert("This scheme is coming soon! / இந்த திட்டம் விரைவில் வரும்!");
            return;
        }

        if (!isAuthenticated) {
            navigate(`/login?redirect=/?apply=${targetScheme._id}`);
            return;
        }
        setSelectedScheme(targetScheme);
        setShowForm(true);
    };

    const handleFormComplete = (data) => {
        setSubmissionData(data);
        setShowForm(false);
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
                        checkEligibility={() => navigate('/eligibility')}
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
                <Route path="/eligibility" element={<EligibilityWizard lang={lang} />} />
                <Route path="*" element={<Home lang={lang} schemes={schemes} eligibility={eligibility} handleEligChange={(e) => setEligibility({...eligibility, [e.target.name]: e.target.value})} checkEligibility={() => navigate('/eligibility')} handleApplyClick={handleApplyClick} />} />
            </Routes>

            {showForm && selectedScheme && (
                <MultiStepApplicationForm 
                    lang={lang} 
                    scheme={selectedScheme} 
                    onComplete={handleFormComplete} 
                    onClose={() => setShowForm(false)} 
                />
            )}

            {submissionData && (
                <SuccessModal 
                    data={submissionData} 
                    onClose={() => setSubmissionData(null)} 
                />
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
