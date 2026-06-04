import { generateClient } from "aws-amplify/data";
import type { Schema } from "../types/amplify";

type DataClient = ReturnType<typeof generateClient<Schema>>;

let dataClient: DataClient | null = null;

/** Lazily create the Amplify data client after Amplify.configure has run. */
export function getDataClient() {
  dataClient ??= generateClient<Schema>();
  return dataClient;
}

export const publicDataOptions = {
  authMode: "apiKey" as const
};

export const userDataOptions = {
  authMode: "userPool" as const
};
