import React, { useState } from 'react'
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = {
        fullname, email, password
      }
      const res = await axios.post('/api/auth/signup', data);
      if (res.status === 201) {
        setLoading(false);
        setError('');
        setEmail('');
        setPassword('');
        setFullname('');
        navigate('/login');
      }
    } catch (error) {
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
              <Card.Title className='text-center text-uppercase fw-bold fs-3 mb-2'>Signup</Card.Title>
              <Card.Subtitle className="mb-4 text-muted text-center">Manage your stocks</Card.Subtitle>
              <Form onSubmit={handleSignup}>
                <Form.Group className="my-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Button className='bg-primary bg-gradient' type='submit' style={{ width: '100%' }}>
                  {
                    loading ? <div className='d-flex justify-content-center align-items-center'>
                      <Spinner animation="border" /><span className='ms-2'>Signing up</span>
                    </div> : 'SIGNUP'
                  }
                </Button>
              </Form>
              <div className='text-center text-muted my-2'>
                OR
              </div>
              <div className='text-center'>
                Having an account?
                <Link to='/login' className='ms-2'>
                  Login
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

export default Signup