import express from "express";
import dotenv from 'dotenv';
import sequelize from "./config/database.js";
import authRoutes from "./Routes/auth.route.js";
import adminRoutes from "./Routes/admin.route.js";
import merchantRoutes from "./Routes/merchant.route.js";
import stockRoutes from "./Routes/stock.route.js";
import cors from 'cors';
import path from 'path';

const PORT = process.env.PORT || 3000
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/stocks', stockRoutes);


sequelize.sync().then(() => {
    console.log('Database Connected')
}).catch((err) => {
    console.log('Error connecting database:' ,err);
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client','dist', 'index.html' ))
})
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
