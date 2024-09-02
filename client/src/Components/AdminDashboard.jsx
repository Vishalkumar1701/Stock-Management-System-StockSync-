import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Spinner } from 'react-bootstrap'
import AdminTable from '../Pages/AdminTable';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AdminupdateStart, AdminupdateSuccess, AdminupdateFailure } from '../Redux/admin/adminSlice'

const AdminDashboard = () => {
  const { currentadminUser } = useSelector((state) => state.admin);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [user, setUser] = useState('');
  const [fullname, setFullname] = useState(currentadminUser ? currentadminUser.admin.fullname : '');
  const [email, setEmail] = useState(currentadminUser ? currentadminUser.admin.email : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = () => setShowDelete(true);

  const admin_token = localStorage.getItem('admin_token');

  const getAdmin = async (adminId) => {
    try {
      const res = await axios.get(`/api/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${admin_token}`
        }
      });
      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (error) {
      setError(error);
    }
  }
  useEffect(() => {
    if (currentadminUser) {
      getAdmin(currentadminUser.admin.id);
    }
  }, [])

  const EditAccount = async () => {
    setLoading(true);
    setError('')
    dispatch(AdminupdateStart());
    const data = {};
    if (fullname) data.fullname = fullname;
    if (email) data.email = email;

    try {
      const res = await axios.put(`/api/admin/${currentadminUser.admin.id}`, data, {
        headers: {
          Authorization: `Bearer ${admin_token}`
        }
      });
      if (res.status === 200) {
        dispatch(AdminupdateSuccess(res.data))
        getAdmin();
        handleClose();
        setLoading(false);
        setError('')
      }
    } catch (error) {
      dispatch(AdminupdateFailure(error));
      setError(error.message);
    }
  }

  const deleteAccount = async () => {
    try {
      const res = await axios.delete(`/api/admin/${currentadminUser.admin.id}`, {
        headers: {
          Authorization: `Bearer ${admin_token}`
        }
      });
      if (res.status === 204) {
        navigate('/admin-login');
      }
    } catch (error) {
      setError(error);
    }
  }


  return (
    <>
      <div className='bg-body-tertiary' style={{ minHeight: '80vh' }}>
        <div className='container'>
          <h2 className='pt-5 text-capitalize'>Welcome, {currentadminUser && currentadminUser.admin.fullname}</h2>
          <span className="badge text-bg-secondary">Admin</span>
          <div className="row border border-primary-subtle rounded p-4 mt-5"
          >
            <div className="col-md-6 col-sm-12">
              <div className='text-nowrap'>
                <span>Id:</span><span> #{user && user.id + moment(user.createdAt).format('MMDDYYYY')} </span>
              </div>

              <div>
                <span>Name :</span><span className='text-capitalize'> {user && user.fullname} </span>
              </div>
              <div>
                <span>Email :</span><span className='text-lowercase'> {user && user.email} </span>
              </div>
              <div>
                <span>Date joined : </span>{moment(user.createdAt).format('DD/MM/YYYY')}<span></span>
              </div>
              <div>
                <span>Date last updated : </span><span> {moment(user.createdAt).fromNow()}</span>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="functional d-flex flex-column gap-4 justify-content-center mt-sm-4">
                <Button className='' style={{ width: '15rem' }} onClick={handleShow}>Edit Your details</Button>
                <Button className='btn-danger' style={{ width: '15rem' }} onClick={handleDeleteShow}>Delete Your Account</Button>
              </div>
            </div>
          </div>
          <div>
            {
              error ? <div className='bg-danger-subtle mx-3 my-1 rounded px-2 py-2'>
                {error}
              </div> : ''
            }
          </div>
          <div className='my-4 d-flex gap-4 justify-content-center align-items-center'>
            <Link to='/admin-dashboard/merchants'>
              <Button>
                Merchant Data
              </Button>
            </Link>

            <Link to='/admin-dashboard/stocks'>
              <Button>
                Stocks Data
              </Button>
            </Link>
          </div>
        </div>
        <hr />
        <div>
          <AdminTable />
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={EditAccount}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="xyz@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type='submit' style={{ width: '100%' }}>
              {
                loading ? <div className='d-flex justify-content-center align-items-center'>
                  <Spinner animation="border" /><span className='ms-2'>Updating...</span>
                </div> : 'Update'
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
          <Button variant="danger" onClick={deleteAccount} style={{ width: '80%' }}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminDashboard