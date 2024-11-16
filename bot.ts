import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { CONFIG } from "./config";
import { askQuestion } from "./src/utils";
import { handleNewMessage } from "./src/handlers";

let isActive = true;

async function main() {
  const client = new TelegramClient(
    new StringSession(""),
    CONFIG.apiId,
    CONFIG.apiHash,
    {
      connectionRetries: 5,
    },
  );

  await client.start({
    phoneNumber: () => Promise.resolve(CONFIG.phone || ""), //  async () => await askQuestion("Введите номер телефона: "),
    password: async () => await askQuestion("Password: "),
    phoneCode: async () => await askQuestion("Code from Telegram: "),
    onError: (err) => console.log(err),
  });

  client.session.save();

  client.addEventHandler(async (event) => {
    if (!event.message || !(event.message instanceof Api.Message)) {
      return; // Not a message
    }

    const chatId = event.message.peerId;
    const userMessage = event.message.message;
    const chat = await client.getEntity(chatId);
    if (
      !(
        "username" in chat &&
        chat.username &&
        CONFIG.listenToChats.includes(chat.username)
      )
    ) {
      return; // Not listening to this chat
    }

    // Commands
    const sayStatus = async () => {
      await client.sendMessage(chatId, {
        message: getStatus(),
        replyTo: event.message.id,
      });
    };

    if (userMessage === "/start") {
      isActive = true;
      await sayStatus();
      return;
    }

    if (userMessage === "/stop") {
      isActive = false;
      await sayStatus();
      return;
    }

    if (userMessage === "/status") {
      await sayStatus();
      return;
    }

    if (!isActive) {
      console.log("Bot is inactive. Ignoring message.");
      return;
    }

    await handleNewMessage(client, event.message);
  });

  console.log("Userbot started...");
}

main().catch((err) => console.error("Error:", err));

function getStatus(): string {
  return isActive ? "Bot is active" : "Bot is stopped";
}
