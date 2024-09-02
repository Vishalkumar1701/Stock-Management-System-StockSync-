import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { currentadminUser } = useSelector((state) => state.admin);

    return currentadminUser ? <Outlet /> : <Navigate to='/admin-login' />
}

export default AdminRoute