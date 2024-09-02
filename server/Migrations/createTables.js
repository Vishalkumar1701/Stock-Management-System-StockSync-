import sequelize from "../config/database.js";
import dotenv from 'dotenv';
dotenv.config();

import Merchant from "../Models/merchant.model.js";
import Stocks from "../Models/stocks.model.js";
import Admin from "../Models/admin.model.js";



const createTables = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Tables created successfully.');
        process.exit(0);
    } catch (error) {
        console.log('Error creating tables:' ,error);
        process.exit(1);        
    }
};

createTables();