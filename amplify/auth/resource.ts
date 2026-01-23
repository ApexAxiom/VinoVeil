import { defineAuth } from "@aws-amplify/backend";

/** Amplify Auth configuration for VinoVeil. */
export const auth = defineAuth({
  loginWith: {
    email: true
  },
  groups: ["ADMINS"]
});
