import React, { useState } from 'react';
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logInStart, logInFailure, logInSuccess } from '../Redux/merchant/merchantSlice';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(logInStart());
    setLoading(true);
    setError('');
    try {
      const data = {
        email, password
      }
      const res = await axios.post('/api/auth/login', data);
      if (res.status === 200) {
        dispatch(logInSuccess(res.data.displayMerchant));
        localStorage.setItem('token', res.data.token);
        setLoading(false);
        setError('');
        setEmail('');
        setPassword('');
        navigate('/');
      }
    } catch (error) {
      dispatch(logInFailure(error));
      setError('Please try again later');
      setLoading(false);
    }
  }

  return (
    <>
      <div className='bg-body-tertiary d-flex justify-content-center align-items-center' style={{ minHeight: '80vh', width: '100%' }}>
        <div>
          <Card style={{ width: '20rem' }}>
            <Card.Body>
              <Card.Title className='text-center text-uppercase fw-bold fs-3 mb-2'>LogIn</Card.Title>
              <Card.Subtitle className="mb-4 text-muted text-center">Welcome</Card.Subtitle>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button className='bg-primary bg-gradient' type='submit' style={{ width: '100%' }}>
                  {
                    loading ? <div className='d-flex justify-content-center align-items-center'>
                      <Spinner animation="border" /><span className='ms-2'>Logging In</span>
                    </div> : 'LOGIN'
                  }
                </Button>
              </Form>
              <div className='text-center text-muted my-2'>
                OR
              </div>
              <div className='text-center'>
                Create an account?
                <Link to='/signup' className='ms-2'>
                  Signup
                </Link>
              </div>
              <hr />
              <div className='text-center'>
                Admin &rarr;
                <Link to='/admin-login' className='ms-2'>
                  Admin
                </Link>
              </div>
            </Card.Body>
            {
              error ? <div className='bg-danger-subtle mx-3 my-1 rounded px-2 py-2'>
                {error}
              </div> : ''
            }
          </Card>
        </div>
      </div>
    </>
  )
}

export default Login