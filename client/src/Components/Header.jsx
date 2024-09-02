import React from 'react'
import { Navbar, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logOutSuccess } from '../Redux/merchant/merchantSlice'
import { AdminlogOutSuccess } from '../Redux/admin/adminSlice'
import { useNavigate, Link } from 'react-router-dom'


const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.merchant);
    const { currentadminUser } = useSelector((state) => state.admin);

    const handleLogOut = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin_token');
        if (currentUser) {
            dispatch(logOutSuccess());
            navigate('/login');
        }
        if (currentadminUser) {
            dispatch(AdminlogOutSuccess());
            navigate('/admin-login');
        }
    }

    return (
        <>
            <Navbar className='bg-primary bg-gradient'>
                <div className="container">
                    <div className="logo" style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#007bff',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                        fontFamily: 'Arial, sans-serif',
                        letterSpacing: '2px',
                        padding: '10px 20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 8px rgba(0, 123, 255, 0.3)',
                    }}>
                        StockSync
                    </div>
                    {
                        currentUser || currentadminUser ? <div className="functionality">
                            <Button onClick={handleLogOut} className=' bg-danger bg-gradient'>
                                Log Out
                            </Button>
                        </div> : <div className="functionality">
                            <Link to='/login'>
                                <Button className=' bg-danger bg-gradient'>
                                    Log In
                                </Button>
                            </Link>
                        </div>
                    }
                </div>
            </Navbar>
        </>
    )
}

export default Header