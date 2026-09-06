# Public data authorization

The catalog and contact form use the existing Cognito identity pool with temporary IAM credentials. Guests and signed-in visitors receive the same public permissions; signed-in visitors require an authenticated identity-pool rule as well as the guest rule. Account, order, checkout and admin authorization continue to use their existing user-pool rules.

| Public operation | Guest and authenticated identity-pool access |
|---|---|
| Product / ProductVariant | Read only |
| ContactMessage | Create only; existing ADMINS access retained |
| sendContactMessage | Invoke the existing contact mutation |
| UserProfile / Order / checkout mutations | No public identity-pool grant |

The previous browser API key expired on July 5, 2026. Cloudflare copied the existing generated configuration faithfully, including that expired key; the same public requests already returned 401 on the prior AWS frontend. The backend now has no API keys. Replacing that credential would restore a recurring expiry dependency. The existing identity pool already supports guests. Do not attach broad AppSync, DynamoDB or administrator policies by hand.

Amplify uses two authorization layers. Its generated IAM policies cover this API's three participating models and contact mutation, including model operations that the public rules do not allow. The generated resolver authorization stages enforce read-only catalog access and create-only contact access. Inspect both layers: IAM field enumeration alone is not proof of effective operation access. There are no identity-pool policy grants for Order, UserProfile or checkout. Local template-evaluator checks of both guest and signed-in identities must deny product writes, contact reads/updates/deletes and private operations, while allowing the public operations above.

## Coordinated release

This repair needs an AWS backend release before the matching frontend release. It is separate from the DNS/hosting migration. A client-only release will fail because the previously deployed guest role has no policy grants.

1. Review the source change, locked install, tests and synthesized CloudFormation. Confirm existing user/identity pools, API URL, tables, Lambda functions and owner/group permissions remain unchanged. Check the generated IAM scope and resolver enforcement together as described above. No product or other application records should be created.
2. Use the existing Amplify backend authority: app `dcwxclg67phng`, branch `main`, root stack `amplify-dcwxclg67phng-main-branch-743bc0aaab`. The existing `amplify.yml` runs `ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID`; its install now uses the same locked npm 11.4.2 / legacy-peer semantics as the Cloudflare workflow. Keep its existing environment values, including contact/SES configuration. Do not create a sandbox or point a feature branch at a new backend. Auto-build remains disabled; a release owner must deliberately run the reviewed revision through the existing authority. That historical Amplify job also builds its old hosting artifact; this does not replace the canonical Cloudflare frontend or authorize any DNS change.
3. Read back the deployed API authentication, generated identity-pool role policies and resource identities. Regenerate the real `amplify_outputs.json` for that existing app/main backend. Require unchanged region, API URL, user-pool ID/client ID and identity-pool ID; require guest identities enabled and updated model introspection. There should be no public API key requirement. Never substitute an empty configuration or a fabricated backend.
4. Replace the existing GitHub **Production** environment `AMPLIFY_OUTPUTS_JSON` through the established protected configuration path, without printing it. Do not commit the generated outputs. The existing Cloudflare workflow still validates and injects that configuration; it remains the only frontend deployer after cutover and does not deploy AWS resources.
5. Dispatch the existing manual/main Cloudflare workflow on the reviewed main revision. Verify the exact source and deployment, public reads from apex and www, and expired-key independence. Validate with an existing signed-in owner session as well as a guest; then verify owner-only routes still require their prior authorization. A real contact send and email delivery require separately authorized owner acceptance.

`npm test` compiles the real Amplify schema for the authorization assertions in `src/tests/publicDataAccess.test.ts`; `npm run build` checks and builds the frontend. The tests create no AWS resources and send no messages. Live IAM and actual delivery remain release gates even when local tests pass.

Before the repair, live Product and ProductVariant tables each contained zero records. A successful empty response is the correct current result. The pre-existing seeded error fallback and checkout placeholder are not proof of inventory or payment readiness. Do not add products to make acceptance look successful.

Keep the prior source/configuration and provider identifiers for rollback. Rolling the frontend back to an expired API key restores the prior outage, so the preferred recovery for an auth-only regression is to correct or restore the reviewed IAM configuration while retaining the current public-read frontend. Do not silently create a replacement key, broaden permissions or run a second deployment authority as a rollback shortcut.

References: [Amplify public identity-pool access](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/), [signed-in identity-pool access](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/).
