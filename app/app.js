const { DateTime } = require('luxon');
const { Bot } = require('grammy')

const bot = new Bot(process.env[`${process.argv[2]}_TG`]);

bot.init().then(async e => {
    let nombre_robot = await bot.botInfo
    let hora = DateTime.now().toFormat('H:mm:ss')
    console.log(`El robot ${nombre_robot.username} está en linea`.green, hora.yellow)
    })

bot.start().catch(e => {
    console.log(e)
})

module.exports = {
    bot
}