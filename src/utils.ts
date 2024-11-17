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
