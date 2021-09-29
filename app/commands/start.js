const { generador } = require("../util/generador");
const { respuesta } = require("../util/respuesta");

function start(ctx) {
    let salida = generador('start')
    console.log(salida)
}

module.exports = {
    start
}