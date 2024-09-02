import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import Admin from '../Models/admin.model.js';

const combinedMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            return res.status(401).json({ error: 'Unauthorized access.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const adminUser = await Admin.findOne({
            where: {
                id: decoded.id,
                role: 'admin',
            },
        });

        if (adminUser) {
            req.admin = adminUser;
            return next();
        }
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export default combinedMiddleware;
