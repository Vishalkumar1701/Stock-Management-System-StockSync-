import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminGuestRoute = () => {
    const { currentadminUser } = useSelector((state) => state.admin);
    if (currentadminUser) {
        return <Navigate to='/admin-dashboard' />
    }
    return <Outlet />;
}

export default AdminGuestRoute