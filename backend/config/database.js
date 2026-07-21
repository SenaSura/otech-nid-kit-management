const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database/asset.db",
    logging: false,
});

module.exports = sequelize;