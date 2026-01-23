import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

/** Amplify backend configuration. */
defineBackend({
  auth,
  data
});
