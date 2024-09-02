import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Merchant from "./merchant.model.js";

const Stocks = sequelize.define('Stocks', {
    stockName: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    merchantId: {
        type: DataTypes.INTEGER,
        references: {
            model: Merchant,
            key: 'id',
        },
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    dateAdded: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    timestamps: true,
});

Stocks.belongsTo(Merchant, { as: 'Merchant', foreignKey: 'merchantId' });
Merchant.hasMany(Stocks, { as: 'Stocks', foreignKey: 'merchantId' });

export default Stocks;