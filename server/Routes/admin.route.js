import express from "express";
import {
    getAdminsbyId,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    adminLogin
} from "../Controllers/admin.controller.js";

import adminMiddleware from "../Middleware/adminMiddleware.js";
const router = express.Router();

router.post('/login', adminLogin);
router.post('/create',adminMiddleware, createAdmin);
router.get('/', adminMiddleware, getAllAdmins);
router.get('/:id', adminMiddleware, getAdminsbyId);
router.put('/:id', adminMiddleware, updateAdmin);
router.delete('/:id', adminMiddleware, deleteAdmin);

export default router;