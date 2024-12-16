const bot = require("../bot");

const adminChannelId = "-1002459115704";

module.exports.createOrder = async (req, res) => {
  const { queryId, userId, products, isDiscount, cart } = req.body;
  console.log(isDiscount);
  console.log(products);
  console.log(cart);
  console.log(userId);
  try {
    if (!queryId) {
      return res.status(400).json({ error: "Error queryId" });
    }
    const orderDetails = products
      ? products.map((item, index) => `${index + 1}) ${item.name}`).join("\n")
      : "";

    const successMessage =
      `Success, your order: \n${orderDetails} \nCustomer name: \nDesired time: \nSpecial message: \n` +
      (isDiscount ? "You have received a discount!" : "");

    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Success",
      input_message_content: {
        message_text: successMessage,
      },
    });

    const orderMessage =
      `New order \n ${products
        .map((item, index) => `${index + 1}) ${item.product_id}`)
        .join("")} \n` +
      (isDiscount ? "Discount applied to this order." : "") +
      `\nSpecial message: `;

    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "Accept order", callback_data: `accept_order:${userId}` },
          { text: "Reject", callback_data: `reject_order:${userId}` },
        ],
      ],
    };

    // await bot.sendMessage(adminChannelId, orderMessage, {
    //   reply_markup: replyMarkup,
    // });

    return res.status(200).json({});
  } catch (e) {
    console.error("Error /order:", e);
    return res.status(500).json({ error: e.message });
  }
};
