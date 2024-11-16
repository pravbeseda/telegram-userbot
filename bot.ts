import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as readline from "readline";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const PROMPT = `Анализируй сообщение. Если человек предлагает продать рубли или убли или деревянные,
или поменять рубли на тенге, то отвечай коротко: yes. Во всех остальных случаях отвечай: no.`;

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH || "";
const session = new StringSession(""); // Сохраняет сессию в строковом формате, оставьте пустым при первом запуске

const openai = new OpenAI();

const askQuestion = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans: string) => {
      rl.close();
      resolve(ans);
    }),
  );
};

async function getOpenAIResponse(message: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: message },
    ],
  });

  return completion.choices[0].message.content || "";
}

async function main() {
  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
  });

  // Подключаемся к Telegram
  await client.start({
    phoneNumber: () => Promise.resolve(process.env.PHONE || ""), //  async () => await askQuestion("Введите номер телефона: "),
    password: async () => await askQuestion("Введите пароль: "),
    phoneCode: async () => await askQuestion("Введите код из Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("Бот подключен!");
  client.session.save();

  // Прослушивание сообщений в определенных чатах
  const targetChats = ["ghfjhgfkjfojhasfewyr"];

  client.addEventHandler(async (event) => {
    if (!event.message || !(event.message instanceof Api.Message)) {
      return;
    }

    const message = event.message as Api.Message;
    const chatId = message.peerId;

    const chat = await client.getEntity(chatId);

    if (
      "username" in chat &&
      chat.username &&
      targetChats.includes(chat.username)
    ) {
      const userMessage = message.message;

      try {
        const aiResponse = await getOpenAIResponse(userMessage);
        if (aiResponse === "yes") {
          await client.sendMessage(chat, {
            message: "Возьму!",
          });
        }
      } catch (error) {
        console.error("Error when interacting with OpenAI:", error);
      }
    }
  });

  console.log("Userbot started...");
}

main().catch((err) => console.error("Error:", err));
