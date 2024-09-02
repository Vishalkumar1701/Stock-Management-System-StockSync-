import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = () => {
    const { currentUser } = useSelector((state) => state.merchant);
    if (currentUser) {
        return <Navigate to='/' />
    }
    return <Outlet />;
}

export default GuestRoute