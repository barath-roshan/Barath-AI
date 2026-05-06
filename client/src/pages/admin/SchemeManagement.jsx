import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const SchemeManagement = ({ lang }) => {
    const [schemes, setSchemes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentScheme, setCurrentScheme] = useState({
        nameEn: '', nameTa: '', ministryEn: '', ministryTa: '',
        benefitEn: '', benefitTa: '', benefitDescEn: '', benefitDescTa: '',
        categoryEn: '', categoryTa: '', badgeChar: '', badgeColor: '#ff9933',
        eligibility: { ageMin: 0, ageMax: 100, gender: 'All', incomeMax: 1000000, category: ['General', 'OBC', 'SC', 'ST', 'EWS'] }
    });

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const res = await api.get('/schemes');
            setSchemes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/schemes/${currentScheme._id}`, currentScheme);
            } else {
                await api.post('/admin/schemes', currentScheme);
            }
            setIsEditing(false);
            setCurrentScheme({
                nameEn: '', nameTa: '', ministryEn: '', ministryTa: '',
                benefitEn: '', benefitTa: '', benefitDescEn: '', benefitDescTa: '',
                categoryEn: '', categoryTa: '', badgeChar: '', badgeColor: '#ff9933',
                eligibility: { ageMin: 0, ageMax: 100, gender: 'All', incomeMax: 1000000, category: ['General', 'OBC', 'SC', 'ST', 'EWS'] }
            });
            fetchSchemes();
        } catch (err) {
            alert('Failed to save scheme');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/admin/schemes/${id}`);
            fetchSchemes();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div>
            <div className="admin-actions">
                <button onClick={() => { setIsEditing(false); setCurrentScheme({
                    nameEn: '', nameTa: '', ministryEn: '', ministryTa: '',
                    benefitEn: '', benefitTa: '', benefitDescEn: '', benefitDescTa: '',
                    categoryEn: '', categoryTa: '', badgeChar: '', badgeColor: '#ff9933',
                    eligibility: { ageMin: 0, ageMax: 100, gender: 'All', incomeMax: 1000000, category: ['General', 'OBC', 'SC', 'ST', 'EWS'] }
                }); }}>Add New Scheme</button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
                <h4>{isEditing ? 'Edit Scheme' : 'Create New Scheme'}</h4>
                <div className="form-row">
                    <input type="text" placeholder="Name (EN)" value={currentScheme.nameEn} onChange={e => setCurrentScheme({...currentScheme, nameEn: e.target.value})} required />
                    <input type="text" placeholder="பெயர் (TA)" value={currentScheme.nameTa} onChange={e => setCurrentScheme({...currentScheme, nameTa: e.target.value})} required />
                </div>
                <div className="form-row">
                    <input type="text" placeholder="Ministry (EN)" value={currentScheme.ministryEn} onChange={e => setCurrentScheme({...currentScheme, ministryEn: e.target.value})} required />
                    <input type="text" placeholder="அமைச்சகம் (TA)" value={currentScheme.ministryTa} onChange={e => setCurrentScheme({...currentScheme, ministryTa: e.target.value})} required />
                </div>
                {/* Simplified for brevity, in a real app I'd add all fields */}
                <div className="form-row">
                    <input type="text" placeholder="Category (EN)" value={currentScheme.categoryEn} onChange={e => setCurrentScheme({...currentScheme, categoryEn: e.target.value})} required />
                    <input type="number" placeholder="Max Income" value={currentScheme.eligibility.incomeMax} onChange={e => setCurrentScheme({...currentScheme, eligibility: {...currentScheme.eligibility, incomeMax: e.target.value}})} required />
                </div>
                <button type="submit" className="btn-save">{isEditing ? 'Update' : 'Create'}</button>
            </form>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Ministry</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schemes.map(s => (
                            <tr key={s._id}>
                                <td>{s.nameEn}</td>
                                <td>{s.ministryEn}</td>
                                <td>{s.categoryEn}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => { setIsEditing(true); setCurrentScheme(s); }}>Edit</button>
                                    <button className="btn-delete" onClick={() => handleDelete(s._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchemeManagement;
