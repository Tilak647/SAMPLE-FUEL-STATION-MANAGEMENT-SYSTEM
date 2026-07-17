import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Since our backend might return a role array or single role string, we handle both or just check legacy admin
    // Legacy support: if there are no roles defined in the user object but it's an admin from older login, allow it for now.
    // If we have strict allowedRoles, check against them.
    
    if (allowedRoles && allowedRoles.length > 0) {
        let userRoles = [];
        if (user.roles) {
            userRoles = user.roles;
        } else if (user.role) {
            userRoles = [user.role];
        } else if (localStorage.getItem('admin')) {
             // Fallback for legacy login
             userRoles = ['ROLE_ADMIN'];
        }

        const hasAccess = allowedRoles.some(role => userRoles.includes(role));
        
        if (!hasAccess) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
