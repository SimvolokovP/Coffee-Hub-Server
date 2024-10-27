const bot = require("../bot");

const adminChannelId = "-1002459115704";

module.exports.createOrder = async (req, res) => {
  const { queryId, userId, products = [] } = req.body;

  try {
    if (!queryId) {
      return res.status(400).json({ error: "Error queryId" });
    }

    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Success",
      input_message_content: {
        message_text: `Success, your order: ${products
          .map((item) => item.title)
          .join(", ")} Wait for confirmation from the admin!`,
      },
    });

    const orderMessage = `New order (${userId}): \nProducts: ${products
      .map((item) => item.title)
      .join(", ")}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "Accept order", callback_data: `accept_order:${userId}` },
          { text: "Reject", callback_data: `reject_order:${userId}` },
        ],
      ],
    };

    await bot.sendMessage(adminChannelId, orderMessage, {
      reply_markup: replyMarkup,
    });

    return res.status(200).json({});
  } catch (e) {
    console.error("Error /order:", e);
    return res.status(500).json({ error: e.message });
  }
};
