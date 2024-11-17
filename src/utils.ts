import * as readline from "readline";
import { CONFIG } from "../config";

export const askQuestion = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

export function isListeningToChat(chatName: string): boolean {
  return CONFIG.listenToChats.includes(chatName);
}

export function isAdmin(chatName: string): boolean {
  return CONFIG.adminChats.includes(chatName);
}

export function isWithinWorkingHours(): boolean {
  const currentUtcTime = new Date();

  const timezoneOffsetHours = parseInt(CONFIG.timeZoneOffset, 10);
  const localHours = currentUtcTime.getUTCHours() + timezoneOffsetHours;
  const localMinutes = currentUtcTime.getUTCMinutes();
  const localTime = localHours * 60 + localMinutes;

  const [fromHours, fromMinutes] = CONFIG.timeFrom.split(":").map(Number);
  const [toHours, toMinutes] = CONFIG.timeTo.split(":").map(Number);
  const startTime = fromHours * 60 + fromMinutes;
  const endTime = toHours * 60 + toMinutes;

  const result = localTime >= startTime && localTime < endTime;
  if (!result) {
    console.log("Outside of working hours");
  }

  return result;
}
