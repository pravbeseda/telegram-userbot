import OpenAI from "openai";
import { CONFIG } from "../config";

const openai = new OpenAI({ apiKey: CONFIG.openaiApiKey });

export async function getOpenAIResponse(message: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: CONFIG.prompt },
      { role: "user", content: message },
    ],
  });

  return completion.choices[0].message.content || "";
}
