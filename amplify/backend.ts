import { defineBackend } from "@aws-amplify/backend";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { sendContactMessage } from "./functions/sendContactMessage/resource";

/** Amplify backend configuration. */
const backend = defineBackend({
  auth,
  data,
  sendContactMessage
});

backend.sendContactMessage.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["ses:SendEmail"],
    resources: process.env.CONTACT_SES_IDENTITY_ARN ? [process.env.CONTACT_SES_IDENTITY_ARN] : ["*"]
  })
);
