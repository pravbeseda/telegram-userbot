import { Api, TelegramClient } from "telegram";
import { makeCall } from "./twilio";
import { getOpenAIResponse } from "./openai";

export async function handleNewMessage(
  client: TelegramClient,
  message: Api.Message,
) {
  const chatId = message.peerId;
  const chat = await client.getEntity(chatId);

  const userMessage = message.message;
  console.log("New message:", userMessage);

  try {
    const aiResponse = await getOpenAIResponse(userMessage);
    console.log("aiResponse:", aiResponse);

    if (aiResponse.includes("1")) {
      console.log("Sending answer...");
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
