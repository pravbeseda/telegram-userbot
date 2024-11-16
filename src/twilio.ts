const twilio = require("twilio");
import * as dotenv from "dotenv";

dotenv.config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export const makeCall = () => {
  client.calls
    .create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: process.env.PHONE,
      from: process.env.ALARM_FROM_PHONE,
    })
    .then((call) => console.log("Call started:", call.sid))
    .catch((err) => console.error(err));
};
