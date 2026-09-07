# VinoVeil release and data-fence runbook

This is reviewed preparation, not an instruction to deploy before root's final PR/CI approval. Root owns provider mutations, the owner pause/acceptance and retirement. Do not send a synthetic signup/contact/order. Preserve the private source snapshots and real release receipts; do not put data, credentials or secret values in this repository.

## Fixed resources and immutable releases

AWS account `405894865970`, region `us-east-1`; Cognito `us-east-1_PeGAN338Z`; AppSync `vte7mqv3zjeibgfd2vhypkq64q`. The five original table names are `{ContactMessage,Order,Product,ProductVariant,UserProfile}-vte7mqv3zjeibgfd2vhypkq64q-NONE`.

Cloudflare account `35d983c7e9c919768c31d96a9c0bae9f`, Worker `vinoveil-backend`, D1 `7d3bc7cc-de17-4f72-abb3-6015fb0b9915`, API `api.vinoveil.com`, Pages `vinoveil`. Root created this D1; this branch does not provision another database. Sender `noreply@notify.vinoveil.com` is verified and preview disabled. No real email has been sent by preparation.

Backend and frontend workflows share one concurrency group, run only from main in Production, and deploy their immutable `GITHUB_SHA`. The backend publishes source SHA and state at `/api/health`, verifies the real D1 binding and one 100% active Worker version, and records the version in its run summary. Frontend release refuses a different backend SHA or disabled traffic/email/write gate/auth configuration. Its public `/release.json` records the same frontend/backend SHA. Capture actual pre-cutover Pages deployment ID, Worker version/settings, DNS, and these receipts before changing authority. Never treat a branch name alone as the deployed version.

## Paused bootstrap

1. Review exact-head CI and all three migrations. Root sets Production variable `VINO_D1_DATABASE_ID` to the exact UUID above and keeps the existing `CLOUDFLARE_ACCOUNT_ID` / protected `CLOUDFLARE_API_TOKEN`. The workflow provides the token only to provider steps, not package installation/tests. `AUTH_SECRET` remains in the canonical store as `service.vinoveil-auth-secret`; never copy it into a command argument, source, log or report.
2. Root applies the three migrations to the existing D1 using the reviewed repository config. The first two create empty auth/business tables. The third adds one operational gate initially closed and 33 native triggers across the 11 auth/business tables. It creates no customer/product/order/contact fixture. Use Wrangler's migration journal; do not rerun raw schema SQL or import automatically:

```powershell
# From cloudflare/backend, after loading the existing token through the credential skill.
npx --no-install wrangler d1 migrations list vinoveil-backend --remote
npx --no-install wrangler d1 migrations apply vinoveil-backend --remote
```

If the journal already records `0001_auth.sql` and `0002_data.sql` but `0003_write_fence.sql` failed with `incomplete input`, verify that the gate and triggers were rolled back before applying the pending migration. The repaired triggers use `WHEN ... IS NOT 1` with a single `BEGIN ... END` body, avoiding the nested `CASE ... END` form implicated in [Cloudflare issue 4727](https://github.com/cloudflare/workers-sdk/issues/4727). Local parsing and fence tests do not establish remote success: root must read back the journal, closed gate, and all 33 trigger names after apply. An already-applied `0003` requires separate review; do not replay it or alter its journal entry.

Keep migration files LF-only as enforced by `.gitattributes`; Windows CRLF conversion is a separate reported trigger-migration issue ([14991](https://github.com/cloudflare/workers-sdk/issues/14991)), not an explanation for an LF-only failure.

3. First deployment stays fully paused. Missing provider AUTH_SECRET is allowed only in this state, so root can install it after the Worker exists:

```powershell
gh workflow run deploy-cloudflare-backend.yml --repo ApexAxiom/VinoVeil --ref main -f traffic_enabled=false -f email_enabled=false
```

The guard requires the exact account/UUID/name, all schema/trigger names, closed D1 gate, and no conflicting DNS/Worker consumer. It does not create a D1, migrate/import data, fetch secret values, or enable writes. Health is read-only and reports `authConfigured=false` until root installs the protected secret; every application route is 503. Root then installs the saved secret through the canonical credential workflow and reads back only its name/presence. Recheck verified sender and disabled preview. No real email/signup is needed for bootstrap.

## Source fence and final zero-data gate

The private baseline at 2026-09-07 01:45:42 UTC contained zero rows in all five fully paginated scans and zero Cognito users. It was not fenced. The report includes owner/SYSTEM-only typed backups, checksums and exact source metadata; never replace those with DescribeTable estimates.

Root's prepared private payloads preserve the full supported current AppSync/Cognito update configuration: `appsync-restore.private.json`, `appsync-fence.private.json`, `cognito-restore.private.json`, `cognito-signup-fence.private.json`. Re-read and compare before use; do not apply stale payloads. Verify STS account, API/pool identity, no AppSync API keys, and still zero actual Cognito users. Nonzero identities are a stop: they require complete auth fencing, password reset and owner mapping, not an empty migration assumption.

The AppSync fence changes its sole authentication mode to API_KEY while no API keys exist, removing both prior Cognito and IAM access. The Cognito payload disables public signup (`AdminCreateUserConfig.AllowAdminCreateUserOnly=true`) while preserving the other supported configuration. The zero-user condition is essential: this signup fence is not a general login/reset fence for an existing user population. Root can apply the reviewed private files without printing them:

```powershell
aws appsync update-graphql-api --region us-east-1 --cli-input-json ('file://'+(Join-Path $taskPrivate 'appsync-fence.private.json')) --no-cli-pager
aws cognito-idp update-user-pool --region us-east-1 --cli-input-json ('file://'+(Join-Path $taskPrivate 'cognito-signup-fence.private.json')) --no-cli-pager
```

Also reserve concurrency zero on the three exact application Lambda ARNs from `lambda-fence-metadata.private.json` after confirming their code hash/revision still matches. Current live timeouts are contact10s, draft3s and checkout3s; reserved concurrency is absent on all three. Drain at least the maximum confirmed function timeout plus margin and verify no active application invocation before final table reads. Verify the AppSync mode/no-key fence rejects a read-only request through former authorization paths. Freeze direct operator writes during the window.

Cognito ListUsers is eventually consistent. Repeat its complete inventory after the signup fence and after draining, inspect any late in-flight signup outcome, and retain the old pool through acceptance/recovery; do not claim that one zero response mathematically proves no in-flight identity. If any user appears or the source fence cannot be verified, leave Cloudflare closed and stop for root's identity plan. Re-run the guarded private export into a new restricted directory. Preserve typed unknown/binary fields; reconcile every real row and owner relationship. The current native schema requires one profile per mapped owner and valid product/owner foreign keys: reject unexplained duplicates/orphans rather than dropping them. No importer has been implemented because actual source data is empty.

## Single-authority enable and acceptance

Only after verified source fencing, final private reads/reconciliation, secret installation and root release review, open the D1 gate and deploy the same main SHA with traffic/email enabled:

```powershell
npx --no-install wrangler d1 execute vinoveil-backend --remote --command "UPDATE migration_control SET writes_enabled=1 WHERE id=1;"
gh workflow run deploy-cloudflare-backend.yml --repo ApexAxiom/VinoVeil --ref main -f traffic_enabled=true -f email_enabled=true
```

Check the actual backend receipt, then dispatch `deploy-cloudflare-static.yml` from that exact same main commit. If main advanced, stop and review/deploy the matching backend first. Accept a real owner-controlled inbox signup/code/resend/login/reset/logout and contact, apex/www, and real owner/admin access. Set admin only on the exact verified owner identity; never automatically promote the first signup. No paid checkout/product editor is claimed. Archive actual receipts, fresh counts/checksums and the owner result before retiring any AWS resource.

## Durable Cloudflare fence and rollback

Close the native database gate first. D1 serializes the gate update with writes, and every application INSERT/UPDATE/DELETE trigger checks it, so a request already running in an older Worker also cannot commit a later write. A Worker-only flag or arbitrary sleep cannot provide that guarantee.

```powershell
npx --no-install wrangler d1 execute vinoveil-backend --remote --command "UPDATE migration_control SET writes_enabled=0 WHERE id=1;"
npx --no-install wrangler d1 execute vinoveil-backend --remote --command "SELECT writes_enabled FROM migration_control WHERE id=1;"
gh workflow run deploy-cloudflare-backend.yml --repo ApexAxiom/VinoVeil --ref main -f traffic_enabled=false -f email_enabled=false
```

The application additionally returns503 for all non-health traffic when the gate is closed, including auth session GETs that could refresh stored sessions. Export all real D1 auth/business data privately while closed, preserving secret-store recovery separately. In-flight email already accepted cannot be recalled; do not blindly replay it.

Before any Cloudflare identity/business writes, root may restore the recorded Pages deployment and the exact private AppSync/Cognito configuration, then remove the temporary Lambda concurrency limits (their recorded original state was absent). Confirm that the old backend is healthy before allowing old clients to write.

After Cloudflare registrations or business writes, a simple frontend rollback to AWS is unsafe. Keep both authorities fenced; preserve/reconcile every new identity, password-reset requirement, owner mapping and business delta before AWS resumes. Prefer rolling back only Worker code to the recorded compatible prior Worker version while retaining D1 and the same AUTH_SECRET, then verifying its schema/source/front-end compatibility before reopening the gate. Do not run an old version that predates the SQL fence. No automatic rollback or destructive cleanup is provided by these workflows.
