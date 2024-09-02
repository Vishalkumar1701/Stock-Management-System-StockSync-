import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Admin = sequelize.define('Admin',{
    fullname : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'admin'
    },
},{
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['password']}
    },
    scopes: {
        withPassword: {
            attributes: { include: ['password'] }
        }
    }
});

export default Admin;