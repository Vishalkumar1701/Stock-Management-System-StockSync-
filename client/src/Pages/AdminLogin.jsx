import React, { useState } from 'react'
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AdminlogInStart, AdminlogInSuccess, AdminlogInFailure } from '../Redux/admin/adminSlice'
import axios from 'axios';

const AdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(AdminlogInStart());
        setLoading(true);
        setError('');
        const data = {
            email,
            password
        }
        try {
            const res = await axios.post('/api/admin/login', data);
            if (res.status === 200) {
                dispatch(AdminlogInSuccess(res.data));
                localStorage.setItem('admin_token', res.data.admin_token);
                setLoading(false);
                setError('');
                setEmail('');
                setPassword('');
                navigate('/admin-dashboard');
            } else {
                setError('Enter valid emailId and password');
            }
        } catch (error) {
            console.log(error);
            dispatch(AdminlogInFailure(error));
            if (error.response && error.response.status === 500) {
                setError('Server Error');
            } else if (error.response && error.response.status === 401) {
                setError('Unauthorized access');
            } else {
                setError('An error occurred. Please try again later.');
            }
            setLoading(false);
        }
    }

    return (
        <div className='bg-body-tertiary d-flex justify-content-center align-items-center' style={{ minHeight: '80vh', width: '100%' }}>
            <div>
                <Card style={{ width: '20rem' }}>
                    <Card.Body>
                        <Card.Title className='text-center text-uppercase fw-bold fs-3 mb-2'>Admin</Card.Title>
                        <Card.Subtitle className="mb-4 text-muted text-center">Welcome</Card.Subtitle>
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="my-3">
                                <Form.Label>Passcode</Form.Label>
                                <Form.Control type="password" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button className='bg-primary bg-gradient' type='submit' style={{ width: '100%' }}>
                                {
                                    loading ? <div className='d-flex justify-content-center align-items-center'>
                                        <Spinner animation="border" /><span className='ms-2'>Logging In.....</span>
                                    </div> : <>Admin Panel &rarr;</>
                                }
                            </Button>
                        </Form>
                        <div className='text-center text-muted my-2'>
                            OR
                        </div>
                        <hr />
                        <div className='text-center'>
                            Not Admin?
                            <Link to='/login' className='ms-2'>
                                Login
                            </Link>
                        </div>
                        {
                            error ? <div className='bg-danger-subtle mx-3 my-1 rounded px-2 py-2'>
                                {error}
                            </div> : ''
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default AdminLogin