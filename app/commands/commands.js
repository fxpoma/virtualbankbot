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
        let salida = generador('start')
        respuesta(ctx, salida)
    }
})

bot.api.setMyCommands([
    {
        command: 'tip',
        description: '[/tip <valor>] Enviar recompensa',
    },
    {
        command: 'balance',
        description: '[/balance] Ver balance',
    },
    {
        command: 'transferir',
        description: '[/transferir <valor>] Enviar credito a otro miembro del grupo',
    },
])

bot.command('tip', ctx => {
    ctx.getAuthor().then(author => {
        console.log(author);
        if ((author.status == 'creator'
        ||   author.status == 'administrator'
        ||   author.user.username == 'GroupAnonymousBot')
        &&  (ctx.chat.type == 'group'
        ||   ctx.chat.type == 'supergroup')
        &&  (ctx.message?.reply_to_message)
        &&  (!ctx.message?.reply_to_message.from.is_bot)) {
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
                            respuesta(ctx,salida,{
                                reply_message:ctx.message.reply_to_message.message_id
                            })
                        })
                    }
                }else{
                    respuesta(ctx, 'Transacción invalida\nRazón: <code>No usar comas en la operación</code>',{
                        reply_message:ctx.message.message_id
                    })
                }
            }
        }
    })
})

bot.command('balance', ctx => {
    if (ctx.chat.type == 'group'
    ||  ctx.chat.type == 'supergroup') {
        Balances.findCreateFind({
            where:{
                telegram_id:ctx.from.id,
                group_id:ctx.chat.id
            },
            defaults:{
                telegram_id:ctx.from.id,
                group_id:ctx.chat.id,
                balance: 0
            }
        }).then(balance => {
            let salida = generador('balance',{
                variables:{
                    usuario:ctx.from,
                    balance:parseFloat(balance[0].balance).toFixed(2)
                }
            })
            respuesta(ctx, salida,{
                reply_message:ctx.message.message_id
            })
        })
    }
})

bot.command('transferir', ctx => {
    if ((ctx.chat.type == 'group'
    ||   ctx.chat.type == 'supergroup')
    &&  (ctx.message?.reply_to_message)
    &&  (!ctx.message?.reply_to_message.from.is_bot)) {
        let cantidad = ctx.match.split(' ')
        if (cantidad.length == 1) {
            if (cantidad[0].indexOf(',') == -1) {
                cantidad = parseFloat(cantidad[0])
                Balances.findOne({
                    where:{
                        telegram_id:ctx.from.id,
                        group_id:ctx.chat.id,
                        balance:{
                            [Op.gte]:cantidad
                        }
                    }
                }).then(emisor => {
                    if (emisor) {
                        Balances.findCreateFind({
                            where:{
                                telegram_id:ctx.message.reply_to_message.from.id,
                                group_id:ctx.chat.id
                            }
                        }).then(receptor =>{
                            receptor[0].balance += cantidad
                            emisor.balance -= cantidad
                            receptor[0].save()
                            emisor.save()
                            let salida = generador('transaccion',{
                                variables:{
                                    emisor: ctx.from,
                                    receptor: ctx.message.reply_to_message.from,
                                    cantidad: parseFloat(cantidad).toFixed(2)
                                }
                            })
                            respuesta(ctx, salida,{
                                reply_message:ctx.message.reply_to_message.message_id
                            })
                        })
                    }else{
                        respuesta(ctx, 'Fondos insuficientes',{
                            reply_message:ctx.message.message_id
                        })
                    }
                })
            }else{
                respuesta(ctx, 'Transacción invalida\nRazón: <code>No usar comas en la operación</code>',{
                    reply_message:ctx.message.message_id
                })
            }
        }
    }
})