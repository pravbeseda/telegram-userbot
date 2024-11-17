import { Api, TelegramClient } from "telegram";
import { makeCall } from "./twilio";
import { getOpenAIResponse } from "./openai";
import { CONFIG } from "../config";

const lastMessageTimestamps: Record<string, number> = {};
const MESSAGE_COOLDOWN_MS = CONFIG.cooldownMinutes * 60_000;

export async function handleNewMessage(
  client: TelegramClient,
  message: Api.Message,
  chatName: string,
) {
  const chatId = message.peerId;
  const chat = await client.getEntity(chatId);

  const userMessage = message.message;
  console.log("New message:", userMessage);

  if (!isEnoughTimeSinceLastMessage(chatName)) {
    console.log(`Cooldown active for chat ${chatName}.`);
    return;
  }

  try {
    const aiResponse = await getOpenAIResponse(userMessage);
    console.log("aiResponse:", aiResponse);

    if (aiResponse.includes("1")) {
      console.log("Sending answer...");
      lastMessageTimestamps[chatName] = Date.now();
      await client.sendMessage(chat, {
        message: "Возьму!",
        replyTo: message.id,
      });

      console.log("Calling...");
      makeCall();
    }
  } catch (error) {
    console.error("Error when interacting with OpenAI:", error);
  }
}

function isEnoughTimeSinceLastMessage(chatName: string): boolean {
  const lastTimestamp = lastMessageTimestamps[chatName] || 0;

  return Date.now() - lastTimestamp > MESSAGE_COOLDOWN_MS;
}
