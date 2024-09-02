import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.merchant);

    return currentUser ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute