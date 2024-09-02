import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap'
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Product = () => {
    const { currentUser } = useSelector((state) => state.merchant);
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stockName, setStockName] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [stocksData, setStocksData] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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


    //Create Stocks
    const handleCreateStocks = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const data = {
            stockName,
            price,
            quantity
        }
        try {
            const res = await axios.post('/api/stocks', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 201) {
                setLoading(false);
                setPrice(0);
                setQuantity(0);
                setStockName('');
                handleClose();
                getAllStocks();
            }

        } catch (error) {
            setLoading(false);
            setError(error);
        }
    }

    const getAllStocks = async () => {
        setError('')
        try {
            const query = searchTerm ? `?stockName=${searchTerm}` : '';
            const res = await axios.get(`/api/stocks/getStocks/${currentUser.id}${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 200) {
                if (res.data.length === 0) {
                    setStocksData([]);
                    setError('No stocks available yet');
                } else {
                    setStocksData(res.data);
                    setError('');
                }
            }
        } catch (error) {
            setError('No data avilable yet!');
            setStocksData([]);
        }
    }
    useEffect(() => {
        if (currentUser.id) {
            getAllStocks();
        }
    }, [searchTerm, currentUser.id])

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm) {
            setError('No search term provided');
            setStocksData([]);
        }
        getAllStocks();
    }

    const handleEditStock = async () => {
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
    const handleDeleteStock = async (stockId) => {
        setLoading(true);
        try {
            const res = await axios.delete(`/api/stocks/${selectedStock}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.status === 204) {
                getAllStocks();
                setLoading(false);
                handleDeleteClose();
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <>
            <div className='container'>
                <div className='d-flex justify-content-between'>
                    <h4>Stock Data</h4>
                    <div className="functional">
                        <Button onClick={handleShow}>Add Stock</Button>
                    </div>
                </div>
                <hr />
                <div>
                    <Form onSubmit={handleSearchSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Search Stock Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} required />
                        </Form.Group>
                    </Form>
                </div>
                <div>
                    {
                        error ? <div className='bg-danger-subtle mx-3 mb-3 rounded px-2 py-2'>
                            {error}
                        </div> : ''
                    }
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
                                stocksData && (stocksData.length > 0) ?
                                    stocksData.map((stock) => (
                                        <tr key={stock.id}>
                                            <td>{moment(stock.createdAt).format('DDYYYYMM') + stock.id}</td>
                                            <td>{moment(stock.dateAdded).format('DD/MM/YYYY')}</td>
                                            <td className='text-capitalize'>{currentUser.fullname}</td>
                                            <td className='text-capitalize'>{stock.stockName}</td>
                                            <td>{stock.price}</td>
                                            <td>{stock.quantity}</td>
                                            <td>{(stock.quantity) * (stock.price)}</td>
                                            <td className='d-flex gap-2 justify-content-center'>
                                                <Button onClick={() => handleEditShow(stock)}>
                                                    Edit
                                                </Button>
                                                <Button className='btn-danger ms-2' onClick={() => handleDeleteShow(stock)}>
                                                    Delete
                                                </Button>
                                            </td>

                                        </tr>
                                    ))
                                    : <tr>
                                        <td colSpan={7}>No Data Found Yet</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Add a stock  */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateStocks}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Stock Name" value={stockName} onChange={(e) => setStockName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price(Per Quantity)</Form.Label>
                            <Form.Control type="number" placeholder="Enter Price per quantity" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> Total Quantity</Form.Label>
                            <Form.Control type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                        </Form.Group>
                        <Button variant="primary" type='submit' style={{ width: '100%' }}>
                            {
                                loading ? <div className='d-flex justify-content-center align-items-center'>
                                    <Spinner animation="border" /><span className='ms-2'>Creating Stock...</span>
                                </div> : 'ADD STOCK'
                            }
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} style={{ width: '100%' }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal >

            {/* Edit a Stock */}
            <Modal show={editShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Stocks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditStock}>
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

            {/* Delete stock  */}
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
                    <Button variant="danger" onClick={handleDeleteStock} style={{ width: '80%' }}>
                        Delete Stock
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Product