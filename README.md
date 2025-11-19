# VinoVeil

Single-page Vite + React site for the VinoVeil product marketing experience.

## Local development

```bash
npm install
npm run dev
```

## Deploying to AWS Amplify (Vite)

Amplify Hosting must build and serve the optimized Vite bundle from `dist` to avoid blank pages caused by module scripts resolving to HTML responses.

1. Keep the `amplify.yml` in this repo so Amplify runs `npm run build` and publishes the `dist` directory.
2. In the Amplify console, confirm:
   - **Build command** uses `npm run build` (or the repo `amplify.yml`).
   - **Output directory** is `dist`.
3. Configure a single-page rewrite rule so unknown routes load `/index.html` while static assets bypass the rewrite. A source regex like the following works well:
   ```
   ^[^.]+$|\.(?!(css|gif|ico|jpg|jpeg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)
   ```
   Set the target to `/index.html`, status code `200 (Rewrite)`.

Without these settings Amplify can serve the unbuilt source files, which breaks the `<script type="module" src="/src/main.tsx"></script>` tag and results in a blank screen.
