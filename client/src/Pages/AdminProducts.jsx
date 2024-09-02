import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const AdminProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stockName, setStockName] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [stocksData, setStocksData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);

    //Edit a stock
    const [editShow, setEditShow] = useState(false);
    const handleEditClose = () => setEditShow(false);
    const handleEditShow = (stock) => {
        setEditShow(true);
        setSelectedStock(stock.id);
        setStockName(stock.stockName);
        setPrice(stock.price);
        setQuantity(stock.quantity);
    }

    //Delete a stock
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = (stock) => {
        setDeleteShow(true);
        setSelectedStock(stock.id);
    }

    const token = localStorage.getItem('admin_token');

    const getAllStocks = async () => {
        try {
            const query = searchQuery ? `?searchQuery=${searchQuery}` : '';
            const res = await axios.get(`/api/stocks/getStocks/${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            if (res.status === 200) {
                setStocksData(res.data);
                setError('');
            }
        } catch (error) {
            setError('Error retriving table');
        }
    }
    useEffect(() => {
        getAllStocks();
    }, [searchQuery])
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery) {
            setStocksData([]);
        }
        getAllStocks();
    }

    //Handle edit stocks
    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const data = {};
        if (stockName) data.stockName = stockName;
        if (price) data.price = price;
        if (quantity) data.quantity = quantity;
        try {
            const res = await axios.put(`/api/stocks/${selectedStock}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                setLoading(false);
                setError('');
                handleEditClose();
                getAllStocks();
            }
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    }

    //Handle delete stocks
    const handleDelete = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.delete(`/api/stocks/${selectedStock}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 204) {
                getAllStocks();
                setLoading(false);
                setPrice(0);
                setQuantity(0);
                setStockName('');
                handleDeleteClose();
                setError('');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    }

    return (
        <>
            <div className='container' style={{ minHeight: '80vh' }}>
                <div className="topbar my-3">
                    <h4>Stocks Data</h4>
                </div>
                <div>
                    {
                        error ? <div className='bg-danger-subtle mx-3 mb-3 rounded px-2 py-2'>
                            {error}
                        </div> : ''
                    }
                </div>
                <div className='mb-3'>
                    <Form onSubmit={handleSearchSubmit}>
                        <Form.Control type="search" placeholder="Enter Stock's name or Merchant's name to Search " value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form>
                </div>
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date Added</th>
                                <th>Merchant Name</th>
                                <th>Stock Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Edit / Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stocksData && stocksData.length > 0 ? (
                                    stocksData.map((stock) => (
                                        <tr key={stock.id}>
                                            <td>{moment(stock.dateAdded).format('MMDDYYYY') + stock.id}</td>
                                            <td>{moment(stock.dateAdded).format('DD/MM/YYYY')}</td>
                                            <td className='text-capitalize'>{stock.Merchant.fullname}</td>
                                            <td>{stock.stockName}</td>
                                            <td>{stock.price}</td>
                                            <td>{stock.quantity}</td>
                                            <td>{(stock.price) * (stock.quantity)}</td>
                                            <td className='text-center'>
                                                <Button onClick={() => handleEditShow(stock)}>
                                                    Edit
                                                </Button>
                                                <Button className='btn-danger ms-2' onClick={() => handleDeleteShow(stock)}>
                                                    Delete
                                                </Button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>No data found yet</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Update Stock details  */}
            <Modal show={editShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Stocks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEdit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Stock Name" value={stockName} onChange={(e) => setStockName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type='submit' style={{ width: '100%' }}>
                            {
                                loading ? <div className='d-flex justify-content-center align-items-center'>
                                    <Spinner animation="border" /><span className='ms-2'>Updating....</span>
                                </div> : 'UPDATE'
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
                    <Modal.Title>Delete Stocks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deleting this stock will result in permanently loss of stock data. It wont be retrived later.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete} style={{ width: '80%' }}>
                        Delete Stock
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdminProducts