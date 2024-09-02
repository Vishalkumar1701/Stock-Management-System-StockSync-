import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Merchant = sequelize.define('Merchant', {
    fullname : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateJoined: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    sellerType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Undefined',
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'merchant'
    }
},{
    timestamps: true,
});

export default Merchant;