import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import SchemeManagement from './SchemeManagement';
import ApplicationManagement from './ApplicationManagement';
import UserManagement from './UserManagement';

const AdminDashboard = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return (
                    <div className="admin-stats-grid">
                        <div className="stat-card">
                            <h4>Total Users</h4>
                            <p>{stats?.totalUsers || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Total Schemes</h4>
                            <p>{stats?.totalSchemes || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Total Applications</h4>
                            <p>{stats?.totalApplications || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Pending Reviews</h4>
                            <p>{stats?.pendingApplications || 0}</p>
                        </div>
                    </div>
                );
            case 'schemes':
                return <SchemeManagement lang={lang} />;
            case 'applications':
                return <ApplicationManagement lang={lang} />;
            case 'users':
                return <UserManagement lang={lang} />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h2 style={{ padding: '20px', color: '#ff9933' }}>Admin Panel</h2>
                <nav>
                    <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Dashboard</button>
                    <button className={activeTab === 'schemes' ? 'active' : ''} onClick={() => setActiveTab('schemes')}>Schemes CRUD</button>
                    <button className={activeTab === 'applications' ? 'active' : ''} onClick={() => setActiveTab('applications')}>Applications</button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
                </nav>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h3>
                </header>
                <div className="admin-content">
                    {loading ? <div className="loader">Loading...</div> : renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
