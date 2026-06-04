import { getDataClient, publicDataOptions } from "./dataClient";

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

interface ContactSendResult {
  ok: boolean;
}

type ContactMutationClient = {
  sendContactMessage: (
    input: ContactMessagePayload,
    options: typeof publicDataOptions
  ) => Promise<{ data?: ContactSendResult | null }> | { data?: ContactSendResult | null };
};

/** Send a contact message through the Amplify backend. */
export async function sendContactMessage(payload: ContactMessagePayload) {
  const dataClient = getDataClient();
  const mutations = dataClient.mutations as unknown as ContactMutationClient;
  const response = await Promise.resolve(mutations.sendContactMessage(payload, publicDataOptions));

  if (!response.data?.ok) {
    throw new Error("Contact message was not accepted.");
  }
}
