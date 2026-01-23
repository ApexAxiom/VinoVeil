import { generateClient } from "aws-amplify/data";
import type { Schema } from "../types/amplify";

/** Amplify data client for store operations. */
export const dataClient = generateClient<Schema>();

export const publicDataOptions = {
  authMode: "apiKey" as const
};

export const userDataOptions = {
  authMode: "userPool" as const
};
