const { Users } = require("../../db/projects/users")

function new_user(ctx) {
    Users.findCreateFind({
        where:{
            telegram_id:ctx.from.id,
            first_name:ctx.from.first_name
        }
    })
}

module.exports = new_user