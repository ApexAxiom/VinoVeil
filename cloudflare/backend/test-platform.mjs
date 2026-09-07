import { getPlatformProxy } from 'wrangler';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** Actual disposable local D1; outbound email is deliberately not constructed. */
export async function testPlatform() {
  const config = JSON.parse(await readFile(new URL('./wrangler.jsonc', import.meta.url), 'utf8'));
  delete config.send_email;
  config.main = fileURLToPath(new URL('./worker.mjs', import.meta.url));
  await mkdir(new URL('./.wrangler/', import.meta.url), { recursive: true });
  const configPath = new URL(`./.wrangler/test-${crypto.randomUUID()}.json`, import.meta.url);
  await writeFile(configPath, JSON.stringify(config));
  try {
    return await getPlatformProxy({ configPath: fileURLToPath(configPath), persist: false });
  } finally { await unlink(configPath); }
}
