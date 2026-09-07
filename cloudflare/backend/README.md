# VinoVeil native Cloudflare backend preparation

This is an undeployed replacement for the current AWS authentication/data client. Better Auth **1.7.3** is the only new direct production dependency, approved by the owner; it runs locally on Workers with its native D1 support. Its Kysely implementation is internal to the library. There is no separate ORM, custom auth store or hosted Better Auth account. React remains version 18 and uses credentialed native fetch. The legacy AWS infrastructure source remains available for the current production consumer and rollback until acceptance; this proposed frontend no longer imports Amplify.

## Preserved boundaries

| Current feature | Native implementation |
| --- | --- |
| Email/password signup and confirmation codes | Better Auth password flow, verification required, hashed email OTP, five-minute expiry and three attempts |
| Sign-in/reset/logout | Secure HTTP-only SameSite=Lax host cookies; database sessions; reset revokes sessions; sign-out deletes the session |
| ADMINS gate | Server-owned `user.role='admin'`, mapped to the existing UI group; signup cannot assign role; only verified sessions reach private data |
| Public Product/ProductVariant reads | `/api/products`, `/api/variants`; actual D1 JSON records, honest empty/error states |
| Contact | Public `/api/contact`, validated/size-bounded message, native Email Sending, success only after provider acceptance; existing contact Lambda sends email without storing a ContactMessage |
| Orders/UserProfile | Orders filtered by session user; profile owner fixed server-side; admins read all orders/profiles and retained contact records |
| Checkout/admin editing | Remain unfinished. Draft/payment endpoints return 501 and create nothing; admin UI remains its existing placeholder. No local order or seed-price fallback hides failure. |

Only the currently used auth routes are exposed; passwordless signup, arbitrary email change and additional library endpoints are not published. Exact app origins are checked before writes, including missing-Origin denial. Cross-origin cookies are allowed only for the configured same-site app origins, never wildcard CORS. Better Auth's rate limiter uses D1; contact uses a native atomic counter with salted IP hashes and expiry cleanup. Request bodies are bounded to 16 KiB before parsing. Application/password/OTP/email content is not logged.

Auth tables in `0001_auth.sql` are generated directly from the pinned library/configuration, including its database rate-limit schema. `0002_data.sql` retains business payloads as JSON plus ownership/relationship keys and foreign-key constraints. No migration seeds products, users, orders or contacts. A future import must preserve original typed/unknown fields privately, map any owners to the accepted identity authority, and reconcile all real counts/checksums. Never interpret historical zero counts as a current export.

## Configuration and release gates

Better Auth's successful signup response means an account was created, not that email reached an inbox. If its callback fails, the account remains unverified and cannot sign in; the form offers verification resend and does not claim email was sent. A missing/disabled email configuration blocks new auth mutations before creating any account. Once configured, transient provider failures preserve the library's unverified-account/retry semantics. Even a provider message ID proves acceptance, not inbox delivery.

`wrangler.jsonc` prepares the `EMAIL` native send binding with **email disabled**. It has no real database ID or custom-domain route. Do not run deployment before root supplies verified real resources: Wrangler can provision a missing database automatically. Local development D1 bindings remain `remote:false`, workers.dev and preview URLs are disabled. The proposed origin is `https://api.vinoveil.com`; verify DNS has no other consumer before binding it.

Before deployment root must supply the actual D1 `database_id`, apply the two reviewed schema migrations, bind the accepted API domain and install a generated `AUTH_SECRET` of at least 32 characters from the shared protected store. The configured sender is `noreply@notify.vinoveil.com`, restricted through `send_email.allowed_sender_addresses`; the existing contact recipient is `emailmyconsultant@gmail.com`. Root onboarded `notify.vinoveil.com` and verified its provider-created DNS records on September 7, 2026; provider read-back confirms `enabled=true` and `preview_enabled=false`. No email has been sent. Keep `EMAIL_ENABLED=false` until root reviews the release and permits real owner acceptance. Email Sending uses the existing Cloudflare account; no Resend/SES fallback is introduced.

The existing frontend deployment remains manual, main-only and in Production. It now requires the exact public `VITE_API_BASE_URL=https://api.vinoveil.com`; it does not restore Amplify outputs. No new Worker deployment workflow or provider-write CI is included until the real binding/release is reviewed. Merging this preparation alone does not deploy anything, but dispatching the changed frontend workflow before backend acceptance is unsafe.

Repeat actual Cognito ListUsers at cutover: the historical pool count was zero, but new users may have arrived. Any nonzero result requires an explicit identity/password-reset/owner mapping plan before switching clients. Verify all five original business tables privately and preserve typed backups/checksums. Fence old writers, reconcile D1, establish one auth/data authority and release the frontend only after root acceptance. Retain AWS recovery resources through the recovery window. After new Cloudflare registrations/data writes, rollback must preserve/reconcile those identities and records; simply reverting the frontend is unsafe. Existing Cognito passwords are not exportable for a transparent migration.

The live acceptance gate includes a real owner-controlled inbox signup/code/sign-in/reset/logout flow, real owner/admin boundaries and contact delivery, plus both apex/www origins. No fabricated production score, product, order, customer, signup or email is part of preparation. Product management/payment are not declared working.

## Local verification

```sh
npm ci --no-audit --no-fund
npm run check
npm test
npx --no-install wrangler deploy --dry-run
```

Tests call the real Better Auth handler and real disposable local D1. `test-platform.mjs` removes only the outbound email binding from a temporary local test configuration and replaces delivery with an in-memory test inbox. Constructing a real email binding is unnecessary for offline tests and stalled the local proxy during preparation. No email provider or real mailbox is contacted. `generate-schema.mjs` compiles the pinned auth schema against that local engine; it is not run at startup/deployment. Frontend tests run separately with `npm test` at the repository root. CI is test/build-only and has no account secret or deployment permission.

References: [Better Auth email OTP](https://better-auth.com/docs/plugins/email-otp), [Cloudflare send binding](https://developers.cloudflare.com/email-service/configuration/send-bindings/), [Cloudflare Workers email API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/). Installed 1.7.3 source and generated schema take precedence over later library documentation.
