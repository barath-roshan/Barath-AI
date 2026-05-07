import React, { useState, useReducer } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const initialState = {
  step: 1,
  profile: {
    age: 18,
    gender: '',
    category: '',
    state: 'Tamil Nadu',
    hasBplCard: false,
    annualIncome: 50000,
    needs: []
  }
};

function wizardReducer(state, action) {
  switch(action.type) {
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.data } };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: state.step - 1 };
    case 'TOGGLE_NEED':
      const needs = state.profile.needs.includes(action.need)
        ? state.profile.needs.filter(n => n !== action.need)
        : [...state.profile.needs, action.need];
      return { ...state, profile: { ...state.profile, needs } };
    default:
      return state;
  }
}

const EligibilityWizard = ({ lang }) => {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await api.post('/schemes/check-eligibility', state.profile);
      setResults(res.data);
      dispatch({ type: 'NEXT_STEP' });
    } catch (err) {
      alert('Error checking eligibility');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(state.step) {
      case 1:
        return (
          <div className="wizard-step">
            <h3 style={{ color: 'var(--navy)' }}>About You / உங்களைப் பற்றி</h3>
            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '14px' }}>Age: <strong>{state.profile.age}</strong></label>
              <input type="range" min="18" max="80" value={state.profile.age} onChange={e => dispatch({type: 'UPDATE_PROFILE', data: {age: parseInt(e.target.value)}})} style={{ width: '100%', accentColor: 'var(--saffron)' }} />
            </div>
            <div style={{ marginTop: '25px' }}>
              <label style={{ fontSize: '14px' }}>Gender</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {['Male', 'Female', 'Transgender'].map(g => (
                  <button key={g} onClick={() => dispatch({type: 'UPDATE_PROFILE', data: {gender: g}})} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: state.profile.gender === g ? '2px solid var(--navy)' : '1px solid #ddd', background: state.profile.gender === g ? '#EEF2FF' : 'white' }}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '25px' }}>
              <label style={{ fontSize: '14px' }}>Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                {['General', 'OBC', 'SC', 'ST'].map(c => (
                  <button key={c} onClick={() => dispatch({type: 'UPDATE_PROFILE', data: {category: c}})} style={{ padding: '10px', borderRadius: '10px', border: state.profile.category === c ? '2px solid var(--navy)' : '1px solid #ddd', background: state.profile.category === c ? '#EEF2FF' : 'white' }}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="wizard-step">
            <h3 style={{ color: 'var(--navy)' }}>Location & Finance / இருப்பிடம் மற்றும் நிதி</h3>
            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '14px' }}>Annual Income: <strong>₹{state.profile.annualIncome.toLocaleString()}</strong></label>
              <input type="range" min="0" max="1000000" step="10000" value={state.profile.annualIncome} onChange={e => dispatch({type: 'UPDATE_PROFILE', data: {annualIncome: parseInt(e.target.value)}})} style={{ width: '100%', accentColor: 'var(--saffron)' }} />
            </div>
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '14px' }}>State</label>
                    <select value={state.profile.state} onChange={e => dispatch({type: 'UPDATE_PROFILE', data: {state: e.target.value}})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }}>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Other">Other States</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '14px' }}>BPL Card?</label>
                    <button onClick={() => dispatch({type: 'UPDATE_PROFILE', data: {hasBplCard: !state.profile.hasBplCard}})} style={{ width: '100%', marginTop: '5px', padding: '10px', borderRadius: '8px', border: state.profile.hasBplCard ? '2px solid var(--green)' : '1px solid #ddd', background: state.profile.hasBplCard ? '#ECFDF5' : 'white' }}>{state.profile.hasBplCard ? 'Yes' : 'No'}</button>
                </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="wizard-step">
            <h3 style={{ color: 'var(--navy)' }}>Results / முடிவுகள்</h3>
            {loading ? <div style={{ textAlign: 'center', padding: '40px' }}>Searching...</div> : (
              <div style={{ marginTop: '20px' }}>
                <p style={{ textAlign: 'center', color: '#666' }}>We found {results?.length || 0} schemes for you.</p>
                <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
                  {results?.map(scheme => (
                    <div key={scheme._id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600' }}>{scheme.nameEn}</span>
                      <button onClick={() => navigate(`/schemes/${scheme._id}`)} style={{ padding: '5px 15px', borderRadius: '5px', border: 'none', background: 'var(--navy)', color: 'white', cursor: 'pointer' }}>View</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '80vh', padding: '100px 20px', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        {renderStep()}
        <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
          {state.step > 1 && state.step < 3 && <button onClick={() => dispatch({type: 'PREV_STEP'})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}>Back</button>}
          {state.step === 1 && <button onClick={() => dispatch({type: 'NEXT_STEP'})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--navy)', color: 'white', fontWeight: '700' }}>Next</button>}
          {state.step === 2 && <button onClick={handleCheck} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--saffron)', color: 'white', fontWeight: '700' }}>Check Schemes ✓</button>}
          {state.step === 3 && <button onClick={() => navigate('/schemes')} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--navy)', color: 'white', fontWeight: '700' }}>Explore All</button>}
        </div>
      </div>
    </div>
  );
};

export default EligibilityWizard;
