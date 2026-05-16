# VinoVeil

Luxury ecommerce storefront for VinoVeil wine glass covers.

## Stack decision

VinoVeil stays on **Vite + React + TypeScript** to keep deployment lean on AWS Amplify Hosting while supporting SPA routing, premium UI, and Amplify Gen2 integrations. The existing assets and Vite build pipeline were already in place, making this the most reliable and minimal-change upgrade path.

## Local development

```bash
npm install
npm run dev
```

## Amplify Gen2 backend

1. Install the Amplify CLI (if needed) and run the sandbox:

   ```bash
   npx amplify sandbox
   ```

2. Generate `amplify_outputs.json` after deploying. The frontend reads this file in `src/lib/amplify.ts`.

## Seed the catalog

After deploying Amplify Data, seed the initial catalog (uses repo images):

```bash
npx tsx scripts/seed.ts
```

## Shopify storefront (frontend)

Purchase and waitlist buttons read from `src/config/commerce.ts`. Copy `.env.example` to `.env` and set the `VITE_*` variables documented there, or define the same keys in Amplify Hosting **Environment variables** for production builds.

## Stripe integration stub

Stripe is intentionally stubbed. Update these files when ready:

- `amplify/functions/createCheckoutSession/handler.ts` (create Stripe session)
- `amplify/functions/createDraftOrder/handler.ts` (server-side totals)

## Deploying to AWS Amplify Hosting

Amplify Hosting must build and serve the optimized Vite bundle from `dist` to avoid blank pages caused by module scripts resolving to HTML responses.

1. Keep the `amplify.yml` in this repo so Amplify runs `npm run build` and publishes the `dist` directory.
2. In the Amplify console, confirm:
   - **Build command** uses `npm run build` (or the repo `amplify.yml`).
   - **Output directory** is `dist`.
3. Ensure SPA rewrites are configured (also included in `public/_redirects`) so unknown routes load `/index.html`.
