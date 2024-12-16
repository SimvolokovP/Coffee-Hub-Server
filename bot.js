const TelegramBot = require("node-telegram-bot-api");
const {
  handleStartCommand,
  handleCallbackQuery,
} = require("./controllers/botController");

const token = "TOKEN";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  handleStartCommand(bot, msg);
});

bot.on("callback_query", (callbackQuery) => {
  handleCallbackQuery(bot, callbackQuery); 
});

module.exports = bot;