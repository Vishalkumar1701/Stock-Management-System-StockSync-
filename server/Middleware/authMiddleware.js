import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        return res.status(401).json({error: 'Unauthorised access.'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
        if(err){
            return res.status(403).json({error: 'Forbidden Access'});
        }
        req.user = user;
        next();
    });
};

export default authMiddleware;