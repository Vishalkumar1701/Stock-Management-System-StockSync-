import express from "express";
import {
    getAllMerchants,
    getMerchantById,
    updateMerchant,
    deleteMerchant,
} from "../Controllers/merchant.controller.js";

import authMiddleware from '../Middleware/authMiddleware.js'
import adminMiddleware from '../Middleware/adminMiddleware.js'
import combinedMiddleware from "../Middleware/combinedMiddleware.js";
const router = express.Router();

router.get('/', adminMiddleware, getAllMerchants);
router.get('/:id', authMiddleware, getMerchantById);
router.put('/:id', combinedMiddleware, updateMerchant);
router.delete('/:id', combinedMiddleware, deleteMerchant);

export default router;