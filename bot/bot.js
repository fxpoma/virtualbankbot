const { DateTime } = require('luxon');
const {Telegraf} = require('telegraf')

const bot = new Telegraf(process.env[`${process.argv[2]}_TG`]);



bot.launch().then(async e =>{
    let nombre_robot = await bot.botInfo
    let hora = DateTime.now().toFormat('H:mm:ss')
    console.log(`El robot ${nombre_robot.username} está en linea`.green, hora.yellow)
}).catch(e => {
    console.log(e)
})

module.exports = {
    bot
}