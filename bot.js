const TelegramBot = require("node-telegram-bot-api");
const {
  handleStartCommand,
  handleCallbackQuery,
} = require("./controllers/botController");

const token = "7379688714:AAE6Nyui8U6OR-aNZPargZOiBrBJtCEaBcA";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  handleStartCommand(bot, msg);
});

bot.on("callback_query", (callbackQuery) => {
  handleCallbackQuery(bot, callbackQuery); 
});

module.exports = bot;