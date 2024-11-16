import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { CONFIG } from "./config";
import { askQuestion } from "./src/utils";
import { handleNewMessage } from "./src/handlers";

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
      return;
    }
    await handleNewMessage(client, event.message);
  });

  console.log("Userbot started...");
}

main().catch((err) => console.error("Error:", err));
