import type { Handler } from "aws-lambda";

interface ContactMessageEvent {
  arguments?: {
    name?: unknown;
    email?: unknown;
    message?: unknown;
  };
}

interface ContactSendResult {
  ok: boolean;
}

type SesV2Module = {
  SESv2Client: new (config?: Record<string, unknown>) => {
    send: (command: unknown) => Promise<unknown>;
  };
  SendEmailCommand: new (input: Record<string, unknown>) => unknown;
};

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 4000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const runtimeImport = new Function("specifier", "return import(specifier)") as <T>(
  specifier: string
) => Promise<T>;

let sesModulePromise: Promise<SesV2Module> | null = null;

function getRequiredString(value: unknown, field: string, maxLength: number) {
  const normalized = typeof value === "string" ? value.trim() : "";

  if (!normalized) {
    throw new Error(`${field} is required.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${field} is too long.`);
  }

  return normalized;
}

function parseContactMessage(event: ContactMessageEvent) {
  const args = event.arguments ?? {};
  const name = getRequiredString(args.name, "Name", MAX_NAME_LENGTH);
  const email = getRequiredString(args.email, "Email", MAX_EMAIL_LENGTH).toLowerCase();
  const message = getRequiredString(args.message, "Message", MAX_MESSAGE_LENGTH);

  if (!emailPattern.test(email)) {
    throw new Error("Email is invalid.");
  }

  return { name, email, message };
}

async function loadSesModule() {
  sesModulePromise ??= runtimeImport<SesV2Module>("@aws-sdk/client-sesv2");
  return sesModulePromise;
}

export const handler: Handler<ContactMessageEvent, ContactSendResult> = async (event) => {
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  const siteName = process.env.CONTACT_SITE_NAME?.trim() || "VinoVeil";
  const contact = parseContactMessage(event);

  if (!toEmail || !fromEmail) {
    console.error("Contact email delivery is missing backend email configuration.", {
      hasToEmail: Boolean(toEmail),
      hasFromEmail: Boolean(fromEmail)
    });
    throw new Error("Contact email delivery is not configured.");
  }

  const submittedAt = new Date().toISOString();

  try {
    const { SESv2Client, SendEmailCommand } = await loadSesModule();
    const sesClient = new SESv2Client({});

    await sesClient.send(
      new SendEmailCommand({
        FromEmailAddress: fromEmail,
        Destination: {
          ToAddresses: [toEmail]
        },
        ReplyToAddresses: [contact.email],
        Content: {
          Simple: {
            Subject: {
              Charset: "UTF-8",
              Data: `New ${siteName} concierge message`
            },
            Body: {
              Text: {
                Charset: "UTF-8",
                Data: [
                  `A new ${siteName} contact message was submitted.`,
                  "",
                  `Submitted: ${submittedAt}`,
                  `Name: ${contact.name}`,
                  `Email: ${contact.email}`,
                  "",
                  "Message:",
                  contact.message
                ].join("\n")
              }
            }
          }
        }
      })
    );

    return { ok: true };
  } catch (error) {
    console.error("Contact email delivery failed.", {
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : "Unknown email delivery error"
    });
    throw new Error("Contact email delivery failed.");
  }
};
