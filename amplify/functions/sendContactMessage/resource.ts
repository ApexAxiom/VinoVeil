import { defineFunction } from "@aws-amplify/backend";

/** Lambda for sending concierge contact messages. */
export const sendContactMessage = defineFunction({
  name: "sendContactMessage",
  entry: "./handler.ts",
  timeoutSeconds: 10,
  environment: {
    CONTACT_TO_EMAIL: "emailmyconsultant@gmail.com",
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL ?? "",
    CONTACT_SITE_NAME: "VinoVeil"
  }
});
