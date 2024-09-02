import jwt from 'jsonwebtoken';
import Admin from '../Models/admin.model.js';

const adminMiddleware = async(req,res,next) => {
    try {
        const admin_token = req.header('Authorization').replace('Bearer ','');

        const decoded = jwt.verify(admin_token, process.env.JWT_SECRET);

        const adminUser = await Admin.findOne({
            where: {
                id:decoded.id,
                role: 'admin'
            }
        });

        if(!adminUser) {
            return res.status(403).json({message : 'Admins Only. Access denied'});
        }
        req.admin = adminUser;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Not authorized, token failed'});
    }
};

export default adminMiddleware;