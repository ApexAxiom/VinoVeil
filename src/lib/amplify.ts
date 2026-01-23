import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

/** Configure Amplify client with generated outputs. */
export function configureAmplify() {
  if (Object.keys(outputs ?? {}).length === 0) {
    return;
  }
  Amplify.configure(outputs);
}
