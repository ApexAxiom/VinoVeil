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

`wrangler.jsonc` records the actual root-created D1 `7d3bc7cc-de17-4f72-abb3-6015fb0b9915` and verified sender, with **traffic and email disabled**. Local D1 bindings remain `remote:false`; workers.dev and preview URLs are disabled. The protected release guard creates the isolated `api.vinoveil.com` route only after checking for another DNS/Worker consumer. It never provisions a database or applies/imports data.

Root must apply all three reviewed migrations. `0003_write_fence.sql` creates one operational gate closed by default and native triggers on all auth/business tables. Closing this gate prevents an already-running Worker request from committing a later write; session GETs are also paused because they can refresh stored sessions. `/api/health` performs only a read and reports the exact release SHA, traffic/email/write-gate state and whether an auth secret is configured.

The sender is `noreply@notify.vinoveil.com`, restricted through `send_email.allowed_sender_addresses`; the existing contact recipient is `emailmyconsultant@gmail.com`. Root verified `notify.vinoveil.com` DNS on September 7, 2026, with provider `enabled=true` and `preview_enabled=false`. No email has been sent by preparation. Paused bootstrap may precede root's installation of the canonical saved AUTH_SECRET. Live release requires its provider metadata and runtime configuration; secret values are never read by the release guard. Email Sending uses the existing Cloudflare account with no SES/Resend fallback.

Backend and frontend deployment are manual, main-only and in Production, sharing one concurrency group. The backend deploys and reads back its exact source SHA and real database binding. Frontend deployment requires that same SHA and all readiness gates; its public release receipt records both SHAs. The frontend requires `VITE_API_BASE_URL=https://api.vinoveil.com` and does not restore Amplify outputs. Merging does not deploy; dispatch only after root's review and the relevant gate in [RELEASE.md](RELEASE.md).

Repeat actual Cognito ListUsers at cutover: the historical pool count was zero, but new users may have arrived. Any nonzero result requires an explicit identity/password-reset/owner mapping plan before switching clients. Verify all five original business tables privately and preserve typed backups/checksums. Fence old writers, reconcile D1, establish one auth/data authority and release the frontend only after root acceptance. Retain AWS recovery resources through the recovery window. After new Cloudflare registrations/data writes, rollback must preserve/reconcile those identities and records; simply reverting the frontend is unsafe. Existing Cognito passwords are not exportable for a transparent migration.

The live acceptance gate includes a real owner-controlled inbox signup/code/sign-in/reset/logout flow, real owner/admin boundaries and contact delivery, plus both apex/www origins. No fabricated production product, order, customer, signup or email is part of preparation. Product management/payment are not declared working.

## Local verification

```sh
npm ci --no-audit --no-fund
npm run check
npm test
npx --no-install wrangler deploy --dry-run
```

Tests call the real Better Auth handler and real disposable local D1. `test-platform.mjs` removes only the outbound email binding from a temporary local test configuration and replaces delivery with an in-memory test inbox. Constructing a real email binding is unnecessary for offline tests and stalled the local proxy during preparation. No email provider or real mailbox is contacted. `generate-schema.mjs` compiles the pinned auth schema against that local engine; it is not run at startup/deployment. Frontend tests run separately with `npm test` at the repository root. CI is test/build-only and has no account secret or deployment permission.

References: [Better Auth email OTP](https://better-auth.com/docs/plugins/email-otp), [Cloudflare send binding](https://developers.cloudflare.com/email-service/configuration/send-bindings/), [Cloudflare Workers email API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/). Installed 1.7.3 source and generated schema take precedence over later library documentation.

The reviewed deployment and data-fence procedure is in [RELEASE.md](RELEASE.md). It now records the actual root-created D1 ID, a third operational write-fence migration, safe paused bootstrap before AUTH_SECRET installation, the main-only Production backend workflow and immutable frontend/backend SHA checks. All application traffic and email are disabled in the repository config. The durable D1 gate starts closed; root must explicitly open it after source fencing and reconciliation. The manual backend workflow never applies migrations or imports data.
