// Explicit local schema generation from the pinned library; no remote resources.
import { getMigrations } from 'better-auth/db/migration';
import { writeFile } from 'node:fs/promises';
import { testPlatform } from './test-platform.mjs';
import { authOptions } from './auth.mjs';
console.log('Creating disposable local D1 for schema compilation.');
const platform = await testPlatform();
try {
  const migration = await getMigrations(authOptions({ ...platform.env, AUTH_SECRET: 'offline-schema-generation-secret-only-0123456789' }));
  await writeFile(new URL('./migrations/0001_auth.sql', import.meta.url), '-- Generated from Better Auth 1.7.3. No user data.\n' + await migration.compileMigrations() + '\n');
  console.log('Pinned native D1 auth schema generated.');
} finally { await platform.dispose(); }
