import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const Merchant = () => {

    const token = localStorage.getItem('admin_token');

    const [allMerchants, setAllMerchants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [sellerType, setSellerType] = useState('');
    const [selectedMerchant, setSelectedMerchant] = useState(null);

    //Edit a merchant
    const [editShow, setEditShow] = useState(false);
    const handleEditClose = () => setEditShow(false);
    const handleEditShow = (user) => {
        setSelectedMerchant(user.id);
        setSellerType(user.sellerType);
        setEmail(user.email)
        setFullName(user.fullname)
        setEditShow(true);
    };

    //Delete a merchant
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = (user) => {
        setSelectedMerchant(user.id);
        setDeleteShow(true);
    }



    //Get all Merchants
    const getAllMerchants = async () => {
        try {
            const res = await axios.get('/api/merchant/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 200) {
                setAllMerchants(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getAllMerchants();
    }, [])

    //Edit a merchant
    const handleEditMerchant = async (e) => {
        e.preventDefault();
        const data = {};
        if (fullname) data.fullname = fullname;
        if (email) data.email = email;
        if (sellerType) data.sellerType = sellerType;
        setLoading(true);
        setError('');

        try {
            const res = await axios.put(`/api/merchant/${selectedMerchant}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                setLoading(false);
                setError('');
                getAllMerchants();
                handleEditClose();
            }
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || 'An error occurred while updating.');
        }
    }

    //Delete a merchant
    const handleDeleteMerchant = async () => {
        try {
            const res = await axios.delete(`/api/merchant/${selectedMerchant}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 204) {
                getAllMerchants();
                handleDeleteClose();
            }
        } catch (error) {
            setError(error.response);
        }
    }

    return (
        <>
            <div className='container' style={{ minHeight: '80vh' }}>
                <div className="topbar my-3">
                    <h4>Merchants Data</h4>
                </div>
                <div>
                    {
                        error ? <div className='bg-danger-subtle mx-3 my-1 rounded px-2 py-2'>
                            {error}
                        </div> : ''
                    }
                </div>
                <div className="table">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date Joined</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Seller Type</th>
                                <th>Edit / Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allMerchants && allMerchants.length > 0 ? (
                                    allMerchants.map((user) => (
                                        <tr key={user.id}>
                                            <td>{moment(user.dateJoined).format('DDMMYYYY') + user.id}</td>
                                            <td>{moment(user.dateJoined).format('DD / MM / YYYY')}</td>
                                            <td>{user.fullname}</td>
                                            <td>{user.email}</td>
                                            <td>{user.sellerType}</td>
                                            <td className='text-center'>
                                                <Button onClick={() => handleEditShow(user)}>
                                                    Edit
                                                </Button>
                                                <Button className='btn-danger ms-2' onClick={() => handleDeleteShow(user)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>No Data Available Yet!</td>
                                    </tr>
                                )
                            }

                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Update merchant details  */}
            <Modal show={editShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Merchant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditMerchant}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="xyz@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Seller Type</Form.Label>
                            <Form.Select aria-label="Default select example" value={sellerType} onChange={(e) => setSellerType(e.target.value)}>
                                <option>Open this select menu</option>
                                <option value="Clothes">Clothes</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Stationary">Stationary</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Accessiories">Accessiories</option>
                                <option value="Others">Others</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type='submit' style={{ width: '100%' }}>
                            {
                                loading ? <div className='d-flex justify-content-center align-items-center'>
                                    <Spinner animation="border" /><span className='ms-2'>Updating....</span>
                                </div> : 'Update Merchant'
                            }
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose} style={{ width: '100%' }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={deleteShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Merchant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deleting this account will result in permanently loss of data. It wont be retrived later.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDeleteMerchant} style={{ width: '80%' }}>
                        Delete Merchant
                    </Button>
                </Modal.Footer>
            </Modal>
        </>


    )
}

export default Merchant