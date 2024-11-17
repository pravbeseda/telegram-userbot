import dotenv from "dotenv";
dotenv.config();

const PROMPT = `Анализируй сообщение. Если человек предлагает продать рубли или убли или деревянные,
    или поменять рубли на тенге, или спрашивает кому нужны рубли, то отвечай одной цифрой: 1. 
    Во всех остальных случаях отвечай: 0.`;

export const CONFIG = {
  apiId: Number(process.env.API_ID),
  apiHash: process.env.API_HASH || "",
  phone: process.env.PHONE || "",
  listenToChats: (process.env.LISTEN_TO_CHATS || "").split(","),
  cooldownMinutes: Number(process.env.COOLDOWN_MINUTES) || 10,
  adminChats: (process.env.ADMIN_CHATS || "").split(","),
  openaiApiKey: process.env.OPENAI_API_KEY,
  prompt: PROMPT,
  alarmFromPhone: process.env.ALARM_FROM_PHONE || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
} as const;
