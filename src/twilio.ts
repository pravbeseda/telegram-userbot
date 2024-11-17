import twilio from "twilio";
import { CONFIG } from "../config";

const client = twilio(CONFIG.twilioAccountSid, CONFIG.twilioAuthToken);

export const makeCall = () => {
  client.calls
    .create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: CONFIG.phone,
      from: CONFIG.alarmFromPhone,
    })
    .then((call) => console.log("Call started:", call.sid))
    .catch((err) => console.error(err));
};
