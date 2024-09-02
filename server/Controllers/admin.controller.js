import Admin from '../Models/admin.model.js'
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

//Admin login
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.scope('withPassword').findOne({ where: { email } });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        if (!admin.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const jwtSecret = process.env.JWT_SECRET;

        const admin_token = jwt.sign({ id: admin.id, role: admin.role }, jwtSecret);

        res.status(200).json({
            message: 'Login Successful',
            admin_token,
            admin: {
                id: admin.id,
                fullname: admin.fullname,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Error during admin login:', error);
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message || 'An unexpected error occurred'
        });
        
    }
};


//createAdmin
export const createAdmin = async(req,res) => {
    try {
        const {fullname, email} = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = await Admin.create({
            fullname,
            email,
            password : hashedPassword,
        });
        
        const adminWithoutPassword = await Admin.findByPk(newAdmin.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(201).json(adminWithoutPassword);
    } catch (error) {
        console.error('Error creating admin:', error); // Log the full error
        return res.status(500).json({ error: error.message || 'Error creating admin.' });       
    }
}

//getAllAdmins
export const getAllAdmins = async(req,res) => {
    try {
        const admins = await Admin.findAll();
        res.status(200).json(admins);
    } catch (error) {
        return res.status(500).json(error);
    }
}

//getAdminsbyId
export const getAdminsbyId = async(req,res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if(!admin) {
            return res.status(404).json({error : 'Admin not found.'});
        }
        res.status(200).json(admin);
    } catch (error) {
        return res.status(500).json(error);
    }
}

//updateAdmin
export const updateAdmin = async(req,res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if(!admin){
            return res.status(404).json({error : 'Admin not found.'});
        }
        const {fullname, email, role, password} = req.body;
        await admin.update({fullname, email, role});

        res.status(200).json(admin);
    } catch (error) {
        return res.status(500).json(error);
    }
}

//deleteAdmin
export const deleteAdmin = async(req,res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if(!admin) {
            return res.status(404).json({error : 'Admin not found.'});
        }
        await admin.destroy();
        res.status(204).json({success : 'Admin deleted successfully'});
    } catch (error) {
        return res.status(500).json(error);
    }
}