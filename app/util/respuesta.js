const { Keyboard, Key } = require('telegram-keyboard')

/**
 * Responde o edita un mensaje
 * @param {Object} ctx Contexto del bot
 * @param {string} texto Texto del mensaje
 * @param {Object} param2 Opciones del mensaje
 */

function respuesta(ctx, texto,
        {
            tipo='reply',
            contenido = [],
            columnas = 1,
            reply_message = null
        }={}
    ) {
    let botones = []
    contenido.forEach(boton => {
        if (boton[0] == 'cb') {
            botones.push(Key.callback(boton[1],boton[2]))
        }else if (boton[0] == 'url'){
            botones.push(Key.url(boton[1],boton[2]))
        }
    });
    let teclado = Keyboard.make(botones,{columns:columnas}).inline()
    let adicional = {
        reply_markup: teclado.reply_markup,
        parse_mode: 'HTML',
        reply_to_message_id:reply_message
    }
    if (tipo == 'reply') {
        ctx.reply(texto, adicional)
    }else if (tipo == 'edit'){
        ctx.editMessageText(texto, adicional)
    }
}


module.exports = {
    respuesta
}