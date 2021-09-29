const { Op } = require("sequelize");
const { Balances } = require("../../db/projects/balances");
const { Users } = require("../../db/projects/users");
const { bot } = require("../app");
const new_user = require("../functions/new_user");

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
                cantidad = parseFloat(cantidad)
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
                    })
                }
            }
        }
    })
})