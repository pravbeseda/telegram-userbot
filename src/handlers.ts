import { Api, TelegramClient } from "telegram";
import { makeCall } from "./twilio";
import { getOpenAIResponse } from "./openai";
import { CONFIG } from "../config";

export async function handleNewMessage(
  client: TelegramClient,
  message: Api.Message,
) {
  const chatId = message.peerId;
  const chat = await client.getEntity(chatId);

  if (
    "username" in chat &&
    chat.username &&
    CONFIG.listenToChats.includes(chat.username)
  ) {
    const userMessage = message.message;
    console.log("New message:", userMessage);

    try {
      const aiResponse = await getOpenAIResponse(userMessage);
      console.log("aiResponse:", aiResponse);

      if (aiResponse.includes("1")) {
        console.log("Sending answer...");
        await client.sendMessage(chat, {
          message: "Возьму!",
        });

        console.log("Calling...");
        makeCall();
      }
    } catch (error) {
      console.error("Error when interacting with OpenAI:", error);
    }
  }
}
