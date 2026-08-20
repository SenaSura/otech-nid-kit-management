const sequelize = require("../config/database");
const Kit = require("./kit");
const User = require("./user");

module.exports = {
    sequelize,
    Kit,
    User,
};