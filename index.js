const TelegramBot = require("node-telegram-bot-api");  
const express = require("express");  
const cors = require("cors");  

const token = "7379688714:AAE6Nyui8U6OR-aNZPargZOiBrBJtCEaBcA"; 
const webAppUrl = "https://simvolokovp.github.io/Tg-Shop-test/";  
const adminChannelId = "-1002459115704"; 

const bot = new TelegramBot(token, { polling: true });  
const app = express();  

app.use(express.json());  
app.use(cors());  

bot.sendMessage(adminChannelId, "Тестовое сообщение от бота!")  
  .then(() => {  
    console.log("Сообщение успешно отправлено.");  
  })  
  .catch((error) => {  
    console.error("Ошибка при отправке сообщения:", error.message);  
  });  

bot.on("message", async (msg) => {  
  const chatId = msg.chat.id;  
  const text = msg.text;  

  if (text === "/start") {  
    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {  
      reply_markup: {  
        keyboard: [  
          [{ text: "Перейти в магазин", web_app: { url: webAppUrl } }],  
        ],  
      },  
    });  

    await bot.sendMessage(chatId, "Заходи в наш интернет магазин по кнопке ниже", {  
      reply_markup: {  
        inline_keyboard: [  
          [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],  
        ],  
      },  
    });  
  }  
});  

app.post("/order", async (req, res) => {  
  const { queryId, userId, products = [] } = req.body; 
  try {  
    if (!queryId) {  
      return res.status(400).json({ error: "Отсутствует queryId" });  
    }  

    await bot.answerWebAppQuery(queryId, {  
      type: "article",  
      id: queryId,  
      title: "Успешная покупка",  
      input_message_content: {  
        message_text: `Поздравляю с покупкой, вы приобрели товар: ${products  
          .map((item) => item.title)  
          .join(", ")} Ожидайте подтверждения!`,  
      },  
    });  

    const orderMessage = `Новый заказ от пользователя (${userId}): \nТовары: ${products.map((item) => item.title).join(", ")}`;  
    const replyMarkup = {  
      inline_keyboard: [  
        [  
          { text: "Принять заказ", callback_data: `accept_order:${userId}` }, 
          { text: "Отказаться", callback_data: `reject_order:${userId}` }, 
        ],  
      ],  
    };  

    await bot.sendMessage(adminChannelId, orderMessage, {  
      reply_markup: replyMarkup,  
    });  

    return res.status(200).json({});  
  } catch (e) {  
    console.error("Ошибка в /order:", e);  
    return res.status(500).json({ error: e.message });  
  }  
});  
 
bot.on("callback_query", async (callbackQuery) => {  
  const [action, userId] = callbackQuery.data.split(":");

  let message;  
  if (action === "accept_order") {  
    message = "Ваш заказ принят!";  
  } else if (action === "reject_order") {  
    message = "Ваш заказ отклонен.";  
  }  
  await bot.sendMessage(userId, message);  
  await bot.answerCallbackQuery(callbackQuery.id);  
});  

const PORT = 8000;  

app.listen(PORT, () => console.log("Сервер запущен на порту " + PORT));