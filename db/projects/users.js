const { Sequelize } = require("sequelize");
const { db } = require("../db");

const Users = db.define(
    'users',
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey:true
        },
        telegram_id:{
            type: Sequelize.INTEGER(11)
        },
        first_name:{
            type: Sequelize.TEXT
        }
    }
)

module.exports = {
    Users
}