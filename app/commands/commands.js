const { Op } = require("sequelize");
const { Balances } = require("../../db/projects/balances");
const { Users } = require("../../db/projects/users");
const { bot } = require("../app");
const new_user = require("../functions/new_user");
const { generador } = require("../util/generador");
const { respuesta } = require("../util/respuesta");

bot.command('start', ctx => {
    if (ctx.chat.type == 'private') {
        new_user(ctx)
    }
})

bot.command('tip', ctx => {
    ctx.getAuthor().then(author => {
        if ((author.status == 'creator'
        ||   author.status == 'administrator')
        &&  (ctx.chat.type == 'group'
        ||   ctx.chat.type == 'supergroup')
        &&  (ctx.message?.reply_to_message)) {
            let cantidad = ctx.match.split(' ')
            if (cantidad.length == 1) {
                if (cantidad[0].indexOf(',') == -1) {
                    cantidad = parseFloat(cantidad[0])
                    if (!isNaN(cantidad)) {
                        Balances.findCreateFind({
                            where:{
                                telegram_id:ctx.message.reply_to_message.from.id,
                                group_id:ctx.chat.id
                            },
                            defaults:{
                                telegram_id:ctx.message.reply_to_message.from.id,
                                group_id:ctx.chat.id,
                                balance:cantidad
                            }
                        }).then(balance => {
                            balance[0].balance = balance[0].balance + cantidad
                            balance[0].save()
                            let salida = generador('tip',{
                                variables:{
                                    usuario:ctx.message.reply_to_message.from,
                                    cantidad:parseFloat(cantidad).toFixed(2)
                                }
                            })
                            respuesta(ctx,salida)
                        })
                    }
                }else{
                    respuesta(ctx, 'Transacción invalida, <code>no usar comas en la operación</code>')
                }
            }
        }
    })
})

bot.command('balance', ctx => {
    if (ctx.chat.type == 'group'
    ||  ctx.chat.type == 'supergroup') {
        Balances.findOne({
            where:{
                telegram_id:ctx.from.id,
                group_id:ctx.chat.id
            }
        }).then(balance => {
            let salida = generador('balance',{
                variables:{
                    usuario:ctx.from,
                    balance:parseFloat(balance.balance).toFixed(2)
                }
            })
            respuesta(ctx, salida)
        })
    }
})

bot.command('send', ctx => {
    if (ctx.chat.type == 'group'
    ||  ctx.chat.type == 'supergroup') {
        let cantidad = ctx.match.split(' ')
        if (cantidad.length == 1) {
            cantidad = cantidad[0]
            Balances.findOne({
                where:{
                    telegram_id:ctx.from.id,
                    group_id:ctx.chat.id,
                    balance:{
                        [Op.gte]:cantidad
                    }
                }
            }).then(balance => {
                if (balance) {
                    console.log(balance.balance)
                }else{
                    console.log('No se puede realizar la transacción');
                }
            })
        }
    }
})