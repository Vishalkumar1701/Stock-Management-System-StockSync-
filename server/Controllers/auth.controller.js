import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Merchant from '../Models/merchant.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

export const Signup = async(req,res) => {
    try{
        const {fullname, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newMerchant = await Merchant.create({
            fullname,
            email,
            password: hashedPassword,
        });
        const merchantData = {
            id: newMerchant.id,
            fullname: newMerchant.fullname,
            email: newMerchant.email,
            createdAt: newMerchant.createdAt,
            dateJoined : newMerchant.dateJoined
        };

        res.status(201).json({ message : 'Signed up successfully', merchantData});
    }catch(error){
        res.status(500).json(error);
    }
};

export const Login = async(req,res) => {
    try {
        const {email, password} = req.body;
        const merchant = await Merchant.findOne({where : {email}});

        if(!merchant) {
            return res.status(404).json({error : 'Merchant not found.'});
        }
        const isMatch = await bcrypt.compare(password, merchant.password);
        if(!isMatch){
            return res.status(400).json({error : 'Invalid Credentials'});
        }
        const displayMerchant = {
            createdAt: merchant.createdAt,
            dateJoined: merchant.dateJoined,
            fullname: merchant.fullname,
            email: merchant.email,
            id : merchant.id,
            role: merchant.role,
            sellerType: merchant.sellerType,
            updatedAt : merchant.updatedAt,
        }

        const token = jwt.sign({id: merchant.id}, process.env.JWT_SECRET);

        res.status(200).json({success : 'Logged In Successfully', displayMerchant, token: token});
    } catch (error) {
        console.error('Login Error:', error.message); // Log error message
        console.error('Stack Trace:', error.stack); // Log stack trace
        res.status(500).json(error);
    }
}