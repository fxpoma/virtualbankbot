const { bot } = require("../bot");
const { start } = require("./start");

bot.start(ctx => {
    start(ctx)
})