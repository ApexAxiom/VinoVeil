import assert from 'node:assert/strict';
import { test } from 'node:test';
import { releaseInputs, verifyResources } from './release.mjs';

const env = { GITHUB_REF: 'refs/heads/main', GITHUB_SHA: '1'.repeat(40), CLOUDFLARE_ACCOUNT_ID: '35d983c7e9c919768c31d96a9c0bae9f', VINO_D1_DATABASE_ID: '7d3bc7cc-de17-4f72-abb3-6015fb0b9915', CLOUDFLARE_API_TOKEN: 'offline-fixture', TRAFFIC_ENABLED: 'false', EMAIL_ENABLED: 'false' };
const applicationTables = ['user', 'session', 'account', 'verification', 'rateLimit', 'products', 'product_variants', 'orders', 'user_profiles', 'contact_messages', 'contact_rate_limit'];
const fixture = () => ({ database: { uuid: env.VINO_D1_DATABASE_ID, name: 'vinoveil-backend' }, schema: [{ success: true, results: ['migration_control', ...applicationTables, ...applicationTables.flatMap(name => ['insert', 'update', 'delete'].map(operation => `fence_${name}_${operation}`))].map(name => ({ name })) }], gate: [{ results: [{ writes_enabled: 0 }] }], secrets: [{ name: 'AUTH_SECRET', type: 'secret_text' }], zones: [{ id: 'offline-zone', account: { id: env.CLOUDFLARE_ACCOUNT_ID } }], domains: [], dns: [] });

test('release refuses wrong branch/account, missing resource, and email enabled while fenced', () => {
  releaseInputs(env);
  for (const patch of [{ GITHUB_REF: 'refs/heads/other' }, { CLOUDFLARE_ACCOUNT_ID: 'other' }, { VINO_D1_DATABASE_ID: '' }, { EMAIL_ENABLED: 'true' }]) assert.throws(() => releaseInputs({ ...env, ...patch }));
});

test('release prerequisites reject missing schema/secret and conflicting DNS or Worker ownership', () => {
  verifyResources(fixture(), env);
  verifyResources({ ...fixture(), secrets: [] }, env); // Paused bootstrap can precede protected secret installation.
  assert.throws(() => verifyResources({ ...fixture(), gate: [{ results: [{ writes_enabled: 1 }] }], secrets: [] }, { ...env, TRAFFIC_ENABLED: 'true' }));
  for (const patch of [{ database: { uuid: env.VINO_D1_DATABASE_ID, name: 'other' } }, { schema: [{ success: true, results: [] }] }, { gate: [{ results: [{ writes_enabled: 1 }] }] }, { dns: [{ name: 'api.vinoveil.com' }] }, { domains: [{ hostname: 'api.vinoveil.com', service: 'other', zone_id: 'offline-zone' }] }]) assert.throws(() => verifyResources({ ...fixture(), ...patch }, env));
  verifyResources({ ...fixture(), domains: [{ hostname: 'api.vinoveil.com', service: 'vinoveil-backend', zone_id: 'offline-zone' }], dns: [{ name: 'api.vinoveil.com' }] }, env);
});
