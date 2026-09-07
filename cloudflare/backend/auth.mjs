import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins/email-otp';

export function origins(env) {
  return [new URL(env.AUTH_BASE_URL).origin, ...env.APP_ORIGINS.split(',').map(value => new URL(value.trim()).origin)];
}

export async function sendEmail(env, message) {
  if (env.EMAIL_ENABLED !== 'true' || !env.EMAIL?.send || !env.EMAIL_FROM) throw new Error('Email delivery is unavailable.');
  const result = await env.EMAIL.send({ from: env.EMAIL_FROM, ...message });
  if (!result?.messageId) throw new Error('Email delivery was not accepted.');
}

export function authOptions(env) {
  if (!env.DB || !env.AUTH_SECRET || env.AUTH_SECRET.length < 32) throw new Error('Authentication is not configured.');
  return {
    appName: 'VinoVeil', baseURL: env.AUTH_BASE_URL, basePath: '/api/auth',
    secret: env.AUTH_SECRET, database: env.DB, trustedOrigins: origins(env),
    telemetry: { enabled: false }, logger: { disabled: true },
    emailAndPassword: { enabled: true, requireEmailVerification: true, minPasswordLength: 8, maxPasswordLength: 128, revokeSessionsOnPasswordReset: true },
    emailVerification: { sendOnSignUp: true, sendOnSignIn: true, autoSignInAfterVerification: false },
    session: { expiresIn: 60 * 60 * 24 * 7, cookieCache: { enabled: false } },
    user: { additionalFields: { role: { type: 'string', required: false, defaultValue: 'user', input: false } } },
    advanced: { useSecureCookies: true, ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] },
      defaultCookieAttributes: { httpOnly: true, secure: true, sameSite: 'lax' } },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 60 },
    plugins: [emailOTP({ overrideDefaultEmailVerification: true, disableSignUp: true,
      storeOTP: 'hashed', expiresIn: 300, allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        await sendEmail(env, { to: email, subject: type === 'forget-password' ? 'Reset your VinoVeil password' : 'Verify your VinoVeil email',
          text: `Your VinoVeil code is ${otp}. It expires in 5 minutes. If you did not request this, you can ignore this email.` });
      },
    })],
  };
}

export const createAuth = env => betterAuth(authOptions(env));
