const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Kit = sequelize.define("Kit", {

    kitId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    serialNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    machineType: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    zone: {
        type: DataTypes.STRING,
    },

    city: {
        type: DataTypes.STRING,
    },

    officer: {
        type: DataTypes.STRING,
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "Active",
    }

});

module.exports = Kit;