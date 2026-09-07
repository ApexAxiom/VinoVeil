import { dataClient } from "./dataClient";

export interface ContactMessagePayload { name: string; email: string; message: string }

/** Report acceptance only after the backend confirms email delivery. */
export async function sendContactMessage(payload: ContactMessagePayload) {
  const response = await dataClient.sendContactMessage(payload);
  if (!response.data?.ok) throw new Error("Contact message was not accepted.");
}
