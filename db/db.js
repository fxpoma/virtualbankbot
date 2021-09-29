const colors = require('colors')
const {Sequelize} = require('sequelize')

const db = new Sequelize({
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging:false
})

db.authenticate().then(e => {
    console.log('DB Sequalize is Connected'.bgGreen.white)
}).catch(e =>{
    console.log(e)
})

// db.sync({force:true}).then(e => {
    // console.log('Se han sicnronizado los datos correctamente');
    // console.log(e);
// })

module.exports = {
    db
}