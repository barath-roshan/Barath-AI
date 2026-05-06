import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AdminProtectedRoute;
