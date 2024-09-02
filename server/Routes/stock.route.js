import express from "express";
import {
    getAllStocks,
    getStockById,
    getStockByMerchantId,
    createStock,
    updateStock,
    deleteStock
} from "../Controllers/stock.controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";
import combinedMiddleware from "../Middleware/combinedMiddleware.js";
const router = express.Router();

router.get('/getStocks', adminMiddleware, getAllStocks);
router.get('/getStocks/:id', authMiddleware, getStockByMerchantId);
router.get('/:id', authMiddleware, getStockById);
router.post('/', authMiddleware, createStock);
router.put('/:id', combinedMiddleware, updateStock);
router.delete('/:id',combinedMiddleware, deleteStock);

export default router;