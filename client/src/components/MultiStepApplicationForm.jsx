import React, { useState, useReducer, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const initialState = {
  currentStep: 1,
  totalSteps: 3,
  completedSteps: [],
  errors: {},
  isSubmitting: false,
  formData: {
    personalDetails: {
      fullName: '',
      dateOfBirth: '',
      age: 0,
      gender: '',
      category: '',
    },
    identityDetails: {
      aadhaarNumber: '',
    },
    contactDetails: {
      phone: '',
      currentAddress: {
        street: '',
        district: '',
        state: 'Tamil Nadu',
        pincode: ''
      },
    },
    financialDetails: {
      annualIncome: '',
      bankName: '',
      bankAccountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
    },
    occupationDetails: {
      occupation: 'General',
    },
    declaration: { agreedToTerms: false }
  }
};

function formReducer(state, action) {
  switch(action.type) {
    case 'UPDATE_SECTION':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.section]: { ...state.formData[action.section], ...action.data }
        }
      };
    case 'NEXT_STEP':
      return {
        ...state,
        completedSteps: [...new Set([...state.completedSteps, state.currentStep])],
        currentStep: state.currentStep + 1
      };
    case 'PREV_STEP':
      return { ...state, currentStep: state.currentStep - 1 };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };
    case 'LOAD_DRAFT':
      return { ...state, formData: action.data };
    default:
      return state;
  }
}

const MultiStepApplicationForm = ({ lang, scheme, onComplete, onClose }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { currentStep, totalSteps, formData, errors, isSubmitting } = state;

  useEffect(() => {
    if (user) {
      dispatch({ type: 'UPDATE_SECTION', section: 'personalDetails', data: {
        fullName: user.name || '',
        gender: user.gender || '',
        category: user.category || ''
      }});
      dispatch({ type: 'UPDATE_SECTION', section: 'contactDetails', data: {
        phone: user.phone || '',
        currentAddress: { ...formData.contactDetails.currentAddress, state: user.state || 'Tamil Nadu' }
      }});
    }
  }, [user]);

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.personalDetails.fullName?.trim()) errs.fullName = 'Name is required';
      if (!formData.personalDetails.dateOfBirth) errs.dateOfBirth = 'DOB required';
      if (!formData.personalDetails.gender) errs.gender = 'Select gender';
      if (!formData.personalDetails.category) errs.category = 'Select category';
      const aadhar = formData.identityDetails.aadhaarNumber?.replace(/\s/g,'');
      if (!aadhar || aadhar.length !== 12) errs.aadhaarNumber = 'Valid 12-digit Aadhaar required';
    }
    if (step === 2) {
      if (!formData.contactDetails.phone || formData.contactDetails.phone.length !== 10) errs.phone = '10-digit phone required';
      if (!formData.contactDetails.currentAddress?.street) errs.street = 'Address required';
      if (!formData.contactDetails.currentAddress?.pincode) errs.pincode = 'Pincode required';
      if (formData.financialDetails.annualIncome === '') errs.annualIncome = 'Income required';
      if (!formData.financialDetails.bankName) errs.bankName = 'Bank name required';
      if (!formData.financialDetails.bankAccountNumber) errs.bankAccountNumber = 'Account number required';
      if (formData.financialDetails.bankAccountNumber !== formData.financialDetails.confirmAccountNumber) errs.confirmAccountNumber = 'Numbers do not match';
      
      // Slightly more relaxed IFSC check but still standard length (11 chars)
      if (!formData.financialDetails.ifscCode || formData.financialDetails.ifscCode.length !== 11) {
        errs.ifscCode = 'IFSC must be 11 characters (e.g. UBIN0123456)';
      }
    }
    if (step === 3) {
      if (!formData.declaration.agreedToTerms) errs.declaration = 'Please accept declaration';
    }
    dispatch({ type: 'SET_ERRORS', errors: errs });
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) dispatch({ type: 'NEXT_STEP' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    dispatch({ type: 'SET_SUBMITTING', value: true });
    try {
      const res = await api.post('/applications', {
        schemeId: scheme._id,
        schemeName: scheme.nameEn,
        ...formData,
        familyDetails: { numberOfChildren: 0 },
        occupationDetails: { occupation: formData.occupationDetails.occupation || 'General' },
        identityDetails: { ...formData.identityDetails, rationCardType: 'None' }
      });
      onComplete(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false });
    }
  };

  const calculateAge = (dob) => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age > 0 ? age : 0;
  };

  const handleIfscBlur = async () => {
    const ifsc = formData.financialDetails.ifscCode;
    if (ifsc?.length === 11) {
      try {
        const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
        if (res.ok) {
          const data = await res.json();
          dispatch({ type: 'UPDATE_SECTION', section: 'financialDetails', data: { bankName: data.BANK }});
        }
      } catch (e) {}
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: '20px', width: '90%', maxWidth: '600px', padding: '30px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        
        <h3 style={{ color: 'var(--navy)', marginBottom: '5px' }}>Apply for {scheme.nameEn}</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '25px' }}>Step {currentStep} of {totalSteps}</p>

        <div style={{ height: '4px', width: '100%', background: '#eee', marginBottom: '30px', borderRadius: '2px' }}>
          <div style={{ height: '100%', width: `${(currentStep / totalSteps) * 100}%`, background: 'var(--saffron)', borderRadius: '2px', transition: 'width 0.3s' }}></div>
        </div>

        {currentStep === 1 && (
          <div className="step-content">
            <h4 style={{ marginBottom: '20px' }}>Personal Information</h4>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <input type="text" placeholder="Full Name *" className="form-control" value={formData.personalDetails.fullName} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'personalDetails', data: {fullName: e.target.value}})} />
                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#666' }}>Date of Birth *</label>
                    <input type="date" className="form-control" value={formData.personalDetails.dateOfBirth} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'personalDetails', data: {dateOfBirth: e.target.value, age: calculateAge(e.target.value)}})} />
                    {errors.dateOfBirth && <small className="text-danger">{errors.dateOfBirth}</small>}
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#666' }}>Gender *</label>
                    <select className="form-control" value={formData.personalDetails.gender} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'personalDetails', data: {gender: e.target.value}})}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                    </select>
                    {errors.gender && <small className="text-danger">{errors.gender}</small>}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <select className="form-control" value={formData.personalDetails.category} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'personalDetails', data: {category: e.target.value}})}>
                        <option value="">Category *</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                    </select>
                    {errors.category && <small className="text-danger">{errors.category}</small>}
                </div>
                <div style={{ flex: 2 }}>
                    <input type="text" placeholder="12-digit Aadhaar Number *" className="form-control" value={formData.identityDetails.aadhaarNumber} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'identityDetails', data: {aadhaarNumber: e.target.value.replace(/\D/g, '')}})} />
                    {errors.aadhaarNumber && <small className="text-danger">{errors.aadhaarNumber}</small>}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <h4 style={{ marginBottom: '20px' }}>Contact & Banking</h4>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <input type="text" placeholder="Phone Number *" className="form-control" value={formData.contactDetails.phone} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'contactDetails', data: {phone: e.target.value}})} />
                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                </div>
                <div style={{ flex: 1 }}>
                    <input type="number" placeholder="Annual Income *" className="form-control" value={formData.financialDetails.annualIncome} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'financialDetails', data: {annualIncome: e.target.value}})} />
                    {errors.annualIncome && <small className="text-danger">{errors.annualIncome}</small>}
                </div>
              </div>
              
              <div>
                <input type="text" placeholder="Full Address (Door No, Street) *" className="form-control" value={formData.contactDetails.currentAddress.street} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'contactDetails', data: {currentAddress: {...formData.contactDetails.currentAddress, street: e.target.value}}})} />
                {errors.street && <small className="text-danger">{errors.street}</small>}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <input type="text" placeholder="District *" className="form-control" value={formData.contactDetails.currentAddress.district} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'contactDetails', data: {currentAddress: {...formData.contactDetails.currentAddress, district: e.target.value}}})} />
                </div>
                <div style={{ flex: 1 }}>
                    <input type="text" placeholder="Pincode *" className="form-control" value={formData.contactDetails.currentAddress.pincode} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'contactDetails', data: {currentAddress: {...formData.contactDetails.currentAddress, pincode: e.target.value}}})} />
                    {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
                </div>
              </div>

              <hr />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <input type="text" placeholder="IFSC Code *" className="form-control" value={formData.financialDetails.ifscCode} onBlur={handleIfscBlur} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'financialDetails', data: {ifscCode: e.target.value.toUpperCase()}})} />
                    {errors.ifscCode && <small className="text-danger">{errors.ifscCode}</small>}
                </div>
                <div style={{ flex: 1 }}>
                    <input type="text" placeholder="Bank Name *" className="form-control" value={formData.financialDetails.bankName} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'financialDetails', data: {bankName: e.target.value}})} />
                    {errors.bankName && <small className="text-danger">{errors.bankName}</small>}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <input type="password" placeholder="Account Number *" className="form-control" value={formData.financialDetails.bankAccountNumber} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'financialDetails', data: {bankAccountNumber: e.target.value}})} />
                    {errors.bankAccountNumber && <small className="text-danger">{errors.bankAccountNumber}</small>}
                </div>
                <div style={{ flex: 1 }}>
                    <input type="text" placeholder="Confirm Account *" className="form-control" value={formData.financialDetails.confirmAccountNumber} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'financialDetails', data: {confirmAccountNumber: e.target.value}})} />
                    {errors.confirmAccountNumber && <small className="text-danger">{errors.confirmAccountNumber}</small>}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <h4 style={{ marginBottom: '20px' }}>Review & Declaration</h4>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px', fontSize: '13px' }}>
              <p><strong>Name:</strong> {formData.personalDetails.fullName}</p>
              <p><strong>Aadhaar:</strong> XXXX-XXXX-{formData.identityDetails.aadhaarNumber.slice(-4)}</p>
              <p><strong>Income:</strong> ₹{formData.financialDetails.annualIncome}</p>
              <p><strong>Bank:</strong> {formData.financialDetails.bankName}</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'flex', gap: '10px', fontSize: '13px', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={formData.declaration.agreedToTerms} onChange={e => dispatch({type: 'UPDATE_SECTION', section: 'declaration', data: {agreedToTerms: e.target.checked}})} />
                <span>I declare all info is correct. நான் வழங்கிய தகவல்கள் உண்மை என்று அறிவிக்கிறேன்.</span>
              </label>
              {errors.declaration && <p className="text-danger" style={{ fontSize: '12px' }}>{errors.declaration}</p>}
            </div>
          </div>
        )}

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
          {currentStep > 1 ? (
            <button onClick={() => dispatch({type: 'PREV_STEP'})} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Back</button>
          ) : <div></div>}
          
          {currentStep < 3 ? (
            <button onClick={handleNext} style={{ padding: '10px 30px', borderRadius: '8px', border: 'none', background: 'var(--navy)', color: 'white', cursor: 'pointer' }}>Next</button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '10px 30px', borderRadius: '8px', border: 'none', background: 'var(--green)', color: 'white', cursor: 'pointer' }}>
              {isSubmitting ? 'Submitting...' : 'Submit Application ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepApplicationForm;
