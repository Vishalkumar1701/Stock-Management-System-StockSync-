import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

const AdminTable = () => {
    const { currentadminUser } = useSelector((state) => state.admin);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [adminUser, setAdminUser] = useState([]);
    const [fullname, setFullName] = useState('');
    const [email, setEMail] = useState('');


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const admin_token = localStorage.getItem('admin_token');

    const handleCreateAdmin = async (e) => {
        setLoading(true);
        e.preventDefault();
        const data = {
            fullname,
            email
        }
        try {
            const res = await axios.post('/api/admin/create', data, {
                headers: {
                    Authorization: `Bearer ${admin_token}`
                }
            });
            if (res.status === 201) {
                setLoading(false);
                getAllAdmins();
                handleClose();
                setFullName('');
                setEMail('');
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const getAllAdmins = async () => {
        try {
            const res = await axios(`/api/admin/`, {
                headers: {
                    Authorization: `Bearer ${admin_token}`
                }
            });
            if (res.status === 200) {
                setAdminUser(res.data);
            }
        } catch (error) {
            setError(error.message);
        }
    }
    useEffect(() => {
        getAllAdmins();
    }, [])

    const handleDeleteAdmin = async (adminId) => {
        try {
            const res = await axios.delete(`/api/admin/${adminId}`, {
                headers: {
                    Authorization: `Bearer ${admin_token}`
                }
            });
            if (res.status === 204) {

                getAllAdmins();
            }
        } catch (error) {
            setError(error);
            console.log(error.message);
        }
    }

    return (
        <>
            <div className="container">
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <h4>Admin Panel</h4>
                    <Button onClick={handleShow}>
                        Create Admin
                    </Button>
                </div>
                <div>
                    {
                        error ? <div className='bg-danger-subtle mx-3 my-1 rounded px-2 py-2'>
                            {error || JSON.stringify(error)}
                        </div> : ''
                    }
                </div>
                <div className="table">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date Added</th>
                                <th>Name</th>
                                <th>isAdmin</th>
                                <th>Delete Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminUser && adminUser.length > 0 && currentadminUser?.admin ? (
                                adminUser
                                    .filter(user => user.id !== currentadminUser.admin.id)
                                    .map((user) => (
                                        <tr key={user.id}>
                                            <td>{user && user.id + moment(user.createdAt).format('MMDDYYYY')}</td>
                                            <td>{moment(user.createdAt).format('DD/MM/YYYY')}</td>
                                            <td className='text-capitalize'>{user && user.fullname}</td>
                                            <td className='text-lowercase'>{user && user.role}</td>
                                            <td>
                                                <Button className='btn-danger' style={{ width: '100%' }} onClick={() => handleDeleteAdmin(user && user.id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                            ) : <tr>
                                <td colSpan={4}>No Data Found Yet</td>
                            </tr>}

                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateAdmin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="xyz@gmail.com" value={email} onChange={(e) => setEMail(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type='submit' style={{ width: '100%' }}>
                            {
                                loading ? <div className='d-flex justify-content-center align-items-center'>
                                    <Spinner animation="border" /><span className='ms-2'>Adding admin...</span>
                                </div> : 'ADD ADMIN'
                            }
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} style={{ width: '100%' }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdminTable