User bot for telegram. It's used for monitoring for certain messages and sending answers to them.
It uses OpenAI API to analise messages.
Also, it starts a phone call to alarm you (via Twilio).

## Installation
```bash
npm install
```
Create a file `.env` with the following content:
```
PHONE=  // phone number for Telegram
API_ID=  // Telegram API ID
API_HASH= // Telegram API hash
LISTEN_TO_CHATS= // chats to listen to messages
COOLDOWN_MINUTES= // cooldown for the bot in minutes    
ADMIN_CHATS= // chats to listen to commands
OPENAI_API_KEY= 
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
ALARM_FROM_PHONE= // phone number to call from
TIME_FROM= // time to start monitoring messages
TIME_TO= // time to stop monitoring messages
TIMEZONE_OFFSET=
```

## Start
```bash
tsx bot.ts
```
or
```bash
node --import tsx bot.ts
```
