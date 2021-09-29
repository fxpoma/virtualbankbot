const { Sequelize } = require("sequelize");
const { db } = require("../db");

const Balances = db.define(
    'balances',
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey:true
        },
        telegram_id:{
            type: Sequelize.INTEGER
        },
        group_id:{
            type: Sequelize.INTEGER
        },
        balance:{
            type: Sequelize.FLOAT
        }
    }
)

module.exports = {
    Balances
}