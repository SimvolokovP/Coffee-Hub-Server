const webAppUrl = "https://simvolokovp.github.io/Tg-Shop-test/";

module.exports.handleStartCommand = async (bot, msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Go to shop!", {
      reply_markup: {
        inline_keyboard: [[{ text: "Shop", web_app: { url: webAppUrl } }]],
      },
    });
  }
};

module.exports.handleCallbackQuery = async (bot, callbackQuery) => {
  const [action, userId] = callbackQuery.data.split(":");
  let message;

  if (action === "accept_order") {
    message = "Your order has been accepted!";
  } else if (action === "reject_order") {
    message = "Your order has been rejected.";
  }

  await bot.sendMessage(userId, message);
  await bot.answerCallbackQuery(callbackQuery.id);
};
