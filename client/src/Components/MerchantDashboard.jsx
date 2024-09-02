import React, { useState } from 'react'
import { Button, Modal, Form, Spinner } from 'react-bootstrap'
import Product from '../Pages/Product'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment';
import axios from 'axios';
import { updateStart, updateFailure, updateSuccess, deleteFailure, deleteStart, deleteSuccess } from '../Redux/merchant/merchantSlice'
import { useNavigate } from 'react-router-dom';

const MerchantDashboard = () => {

  const { currentUser } = useSelector((state) => state.merchant);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullname, setFullName] = useState(currentUser ? currentUser.fullname : '')
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(currentUser ? currentUser.email : '');
  const [sellerType, setSellerType] = useState(currentUser ? currentUser.sellerType : '');


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = () => setShowDelete(true);

  const token = localStorage.getItem('token');

  //Update Merchant details
  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    const data = {};
    if (fullname) data.fullname = fullname;
    if (password) data.password = password;
    if (email) data.email = email;
    if (sellerType) data.sellerType = sellerType;
    setLoading(true);
    setError('');

    try {
      const res = await axios.put(`/api/merchant/${currentUser.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        dispatch(updateSuccess(res.data))
        setLoading(false);
        setError('');
        handleClose();
      }
    } catch (error) {
      dispatch(updateFailure(error));
      console.error('Error:', error);
      setLoading(false);
      setError(error.response?.data?.message || 'An error occurred while updating.');
    }
  }

  //Delete Merchant
  const handleDelete = async () => {
    dispatch(deleteStart())
    try {
      const res = await axios.delete(`/api/merchant/${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 204) {
        navigate('/login');
        dispatch(deleteSuccess(res.data));
      }
    } catch (error) {
      setError(error);
      console.log(error);
      dispatch(deleteFailure());
    }
  }

  return (
    <>
      <div className='bg-body-tertiary' style={{ minHeight: '100vh' }}>
        <div className='container'>
          <h2 className='pt-5'>Welcome,<span className='ms-2 text-capitalize'>
            {currentUser && currentUser.fullname}
          </span></h2>
          <span className="badge text-bg-secondary">Merchant</span>
          <div className="row border border-primary-subtle rounded p-4 mt-5"
          >
            <div className="col-md-6 col-sm-12">
              <div className='text-nowrap'>
                <span>Merchant Id:</span><span> #{currentUser && currentUser.id + moment(currentUser && currentUser.dateJoined).format('MMDDYYYY')} </span>
              </div>

              <div>
                <span>Merchant Name :</span><span className='text-capitalize'> {currentUser && currentUser.fullname}</span>
              </div>
              <div>
                <span>Merchant Email :</span><span className='text-lowercase'> {currentUser && currentUser.email} </span>
              </div>
              <div>
                <span>Type :</span><span > {currentUser && currentUser.sellerType}</span>
              </div>
              <div>
                <span>Date joined : </span><span>{moment(currentUser && currentUser.dateJoined).format('DD/MM/YYYY')}</span>
              </div>
              <div>
                <span>Date last updated : </span><span> {moment(currentUser && currentUser.updatedAt).fromNow()}</span>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="functional d-flex flex-column gap-4 justify-content-center mt-sm-4">
                <Button className='' style={{ width: '15rem' }} onClick={handleShow}>Edit Your details</Button>
                <Button className='btn-danger' style={{ width: '15rem' }} onClick={handleDeleteShow}>Delete Your Account</Button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div>
          <Product />
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="xyz@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="xyz@gmail.com" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Seller Type</Form.Label>
              <Form.Select value={sellerType} onChange={(e) => setSellerType(e.target.value)}>
                <option value="Undefined">Open this select menu</option>
                <option value="Clothes">Clothes</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationary">Stationary</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessiories">Accessiories</option>
                <option value="Appliances">Appliances</option>
                <option value="Books">Books</option>
                <option value="Automotives">Automotives</option>
                <option value="Groceries">Groceries</option>
                <option value="Sports">Sports</option>
                <option value="Footwear">Footwear</option>
                <option value="Multiple">Multiple</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type='submit' style={{ width: '100%' }}>
              {
                loading ? <div className='d-flex justify-content-center align-items-center'>
                  <Spinner animation="border" /><span className='ms-2'>Updating Data...</span>
                </div> : 'UPDATE'
              }
            </Button>
          </Form>
          {
            error ? <div className='bg-danger-subtle mx-3 my-1 rounded px-2 py-2'>
              {error}
            </div> : ''
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} style={{ width: '100%' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Your Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deleting your account will result in permanently loss of data. It wont be retrived later.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteClose} style={{ width: '80%' }}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Your Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deleting your account will result in permanently loss of data. It wont be retrived later.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete} style={{ width: '80%' }}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MerchantDashboard