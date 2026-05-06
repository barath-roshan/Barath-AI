import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const ApplicationManagement = ({ lang }) => {
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/admin/applications');
            setApplications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/admin/applications/${id}`, { status, remarks });
            setRemarks('');
            setSelectedApp(null);
            fetchApplications();
            alert('Updated successfully');
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div className="app-mgmt">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>App #</th>
                        <th>User</th>
                        <th>Scheme</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(app => (
                        <tr key={app._id}>
                            <td>{app.applicationNumber}</td>
                            <td>{app.userId?.name || 'N/A'}</td>
                            <td>{app.schemeId?.nameEn || app.schemeName}</td>
                            <td><span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span></td>
                            <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => setSelectedApp(app)}>View/Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedApp && (
                <div className="modal-overlay">
                    <div className="modal-content admin-modal">
                        <h4>Application Review - {selectedApp.applicationNumber}</h4>
                        <p><strong>Applicant:</strong> {selectedApp.userId?.name} ({selectedApp.userId?.email})</p>
                        <p><strong>Scheme:</strong> {selectedApp.schemeName}</p>
                        <p><strong>Income:</strong> ₹{selectedApp.income}</p>
                        <p><strong>Aadhaar:</strong> {selectedApp.aadhaar}</p>
                        
                        <div style={{ marginTop: '20px' }}>
                            <label>Remarks</label>
                            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add comments..." />
                        </div>
                        
                        <div className="admin-modal-actions">
                            <button className="btn-approve" onClick={() => handleStatusUpdate(selectedApp._id, 'Approved')}>Approve</button>
                            <button className="btn-reject" onClick={() => handleStatusUpdate(selectedApp._id, 'Rejected')}>Reject</button>
                            <button className="btn-review" onClick={() => handleStatusUpdate(selectedApp._id, 'Under Review')}>Mark Under Review</button>
                            <button onClick={() => setSelectedApp(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationManagement;
