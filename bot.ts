import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { CONFIG } from "./config";
import {
  askQuestion,
  containsKeywords,
  isAdmin,
  isListeningToChat,
  isSessionSaved,
  isWithinWorkingHours,
  loadSession,
  saveSession,
} from "./src/utils";
import { handleNewMessage } from "./src/handlers";

let isActive = true;

(async () => {
  const client = new TelegramClient(
    loadSession(),
    CONFIG.apiId,
    CONFIG.apiHash,
    {
      connectionRetries: 5,
    },
  );

  if (!isSessionSaved()) {
    await client.start({
      phoneNumber: async () => CONFIG.phone || "",
      password: async () => await askQuestion("Password: "),
      phoneCode: async () => await askQuestion("Code from Telegram: "),
      onError: (err) => console.log(err),
    });
    saveSession(client.session as StringSession);
    client.session.save();
  } else {
    await client.connect();
  }

  console.log("Userbot started... Connected:", client.connected);

  client.addEventHandler(async (event) => {
    if (!event.message || !(event.message instanceof Api.Message)) {
      return; // Not a message
    }
    const chatId = event.message.peerId;
    const userMessage: string = event.message.message || "";
    const chat = await client.getEntity(chatId);
    const chatName = "title" in chat ? (chat.title ?? "unknown") : "unknown";

    if (!isListeningToChat(chatName) && !isAdmin(chatName)) {
      return;
    }

    console.log({ chatName, userMessage });

    // Commands
    const sayStatus = async () => {
      await client.sendMessage(chatId, {
        message: getStatus(),
        replyTo: event.message.id,
      });
    };

    if (userMessage === "/start" && isAdmin(chatName)) {
      isActive = true;
      await sayStatus();
      return;
    }

    if (userMessage === "/stop" && isAdmin(chatName)) {
      isActive = false;
      await sayStatus();
      return;
    }

    if (userMessage === "/status" && isAdmin(chatName)) {
      await sayStatus();
      return;
    }

    if (!isActive) {
      console.log("Bot is inactive. Ignoring message.");
      return;
    }

    if (isWithinWorkingHours() && containsKeywords(userMessage)) {
      await handleNewMessage(client, event.message, chatName);
    }
  });
})().catch((err) => console.error("Error:", err));

function getStatus(): string {
  return isActive ? "Bot is active" : "Bot is stopped";
}
