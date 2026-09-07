import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const account = '35d983c7e9c919768c31d96a9c0bae9f';
const service = 'vinoveil-backend';
const hostname = 'api.vinoveil.com';
const databaseId = '7d3bc7cc-de17-4f72-abb3-6015fb0b9915';
const tables = ['user', 'session', 'account', 'verification', 'rateLimit', 'products', 'product_variants', 'orders', 'user_profiles', 'contact_messages', 'contact_rate_limit'];

export function releaseInputs(env) {
  assert.equal(env.GITHUB_REF, 'refs/heads/main', 'Release requires main.');
  assert.match(env.GITHUB_SHA ?? '', /^[a-f0-9]{40}$/, 'Exact source commit is required.');
  assert.equal(env.CLOUDFLARE_ACCOUNT_ID, account, 'Unexpected Cloudflare account.');
  assert.match(env.VINO_D1_DATABASE_ID ?? '', /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, 'Reviewed real D1 ID is required.');
  assert.equal(env.VINO_D1_DATABASE_ID, databaseId, 'Database must match the reviewed real resource.');
  for (const name of ['TRAFFIC_ENABLED', 'EMAIL_ENABLED']) assert(['true', 'false'].includes(env[name]), `${name} must be explicit.`);
  assert(env.EMAIL_ENABLED !== 'true' || env.TRAFFIC_ENABLED === 'true', 'Paused releases must disable email.');
  assert(env.CLOUDFLARE_API_TOKEN, 'Existing protected Cloudflare token is required.');
}

async function api(env, path, options = {}, allowMissing = false) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options, headers: { authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`, 'content-type': 'application/json' },
  });
  if (allowMissing && response.status === 404) return [];
  const body = await response.json();
  assert(response.ok && body.success, `Cloudflare prerequisite/read-back failed (${response.status}).`);
  return body.result;
}

export function verifyResources({ database, schema, gate, secrets, zones, domains, dns }, env) {
  assert.equal(database.uuid, env.VINO_D1_DATABASE_ID, 'Wrong database ID.');
  assert.equal(database.name, service, 'Wrong database name.');
  const required = ['migration_control', ...tables, ...tables.flatMap(name => ['insert', 'update', 'delete'].map(operation => `fence_${name}_${operation}`))];
  assert(schema[0]?.success && required.every(name => schema[0].results.some(row => row.name === name)), 'Apply all three reviewed migrations separately before release.');
  assert.equal(gate[0]?.results[0]?.writes_enabled, env.TRAFFIC_ENABLED === 'true' ? 1 : 0, 'D1 write gate must match the reviewed traffic state.');
  if (env.TRAFFIC_ENABLED === 'true') assert(secrets.some(secret => secret.name === 'AUTH_SECRET' && secret.type === 'secret_text'), 'Provision AUTH_SECRET through the protected store before enabling traffic.');
  assert.equal(zones.length, 1, 'Expected one VinoVeil zone.');
  assert.equal(zones[0].account.id, account, 'Unexpected zone account.');
  const current = domains.filter(domain => domain.hostname === hostname);
  assert(current.every(domain => domain.service === service && domain.zone_id === zones[0].id), 'API domain has another Worker consumer.');
  assert(dns.length === 0 || current.length === 1, 'API DNS already exists without this verified Worker consumer.');
}

async function prepare(env) {
  releaseInputs(env);
  const prefix = `/accounts/${account}`;
  const zones = await api(env, '/zones?name=vinoveil.com');
  assert.equal(zones.length, 1, 'Expected one VinoVeil zone.');
  const [database, schema, gate, secrets, domains, dns] = await Promise.all([
    api(env, `${prefix}/d1/database/${env.VINO_D1_DATABASE_ID}`),
    api(env, `${prefix}/d1/database/${env.VINO_D1_DATABASE_ID}/query`, { method: 'POST', body: JSON.stringify({ sql: "SELECT name FROM sqlite_master WHERE type IN ('table','trigger')" }) }),
    api(env, `${prefix}/d1/database/${env.VINO_D1_DATABASE_ID}/query`, { method: 'POST', body: JSON.stringify({ sql: 'SELECT writes_enabled FROM migration_control WHERE id=1' }) }),
    api(env, `${prefix}/workers/scripts/${service}/secrets`, {}, env.TRAFFIC_ENABLED === 'false'),
    api(env, `${prefix}/workers/domains`),
    api(env, `/zones/${zones[0].id}/dns_records?name=${hostname}`),
  ]);
  verifyResources({ database, schema, gate, secrets, zones, domains, dns }, env);
  const config = JSON.parse(await readFile(new URL('./wrangler.jsonc', import.meta.url), 'utf8'));
  config.main = fileURLToPath(new URL('./worker.mjs', import.meta.url));
  config.d1_databases[0].database_id = env.VINO_D1_DATABASE_ID;
  config.d1_databases[0].migrations_dir = fileURLToPath(new URL('./migrations/', import.meta.url));
  config.routes = [{ pattern: hostname, custom_domain: true }];
  Object.assign(config.vars, { RELEASE_SHA: env.GITHUB_SHA, TRAFFIC_ENABLED: env.TRAFFIC_ENABLED, EMAIL_ENABLED: env.EMAIL_ENABLED });
  await mkdir(new URL('./.wrangler/', import.meta.url), { recursive: true });
  await writeFile(new URL('./.wrangler/release.json', import.meta.url), JSON.stringify(config, null, 2));
  console.log('Exact account/database/schema/secret/domain prerequisites passed. No import or secret value was read.');
}

async function verify(env) {
  releaseInputs(env);
  const response = await fetch(`https://${hostname}/api/health`, { cache: 'no-store' });
  assert(response.ok, 'Backend health read-back failed.');
  const health = await response.json();
  assert.equal(health.releaseSha, env.GITHUB_SHA, 'Backend source does not match this release.');
  assert.equal(health.trafficEnabled, env.TRAFFIC_ENABLED === 'true');
  assert.equal(health.emailEnabled, env.EMAIL_ENABLED === 'true');
  assert.equal(health.writesEnabled, env.TRAFFIC_ENABLED === 'true');
  if (env.TRAFFIC_ENABLED === 'true') assert(health.authConfigured, 'Live release is missing authentication secret configuration.');
  const prefix = `/accounts/${account}/workers/scripts/${service}`;
  const settings = await api(env, `${prefix}/settings`);
  assert(settings.bindings.some(binding => binding.name === 'DB' && binding.type === 'd1' && binding.id === env.VINO_D1_DATABASE_ID), 'Deployed database does not match.');
  const deployments = await api(env, `${prefix}/deployments`);
  const latest = deployments.deployments[0];
  assert(latest?.versions.length === 1 && latest.versions[0].percentage === 100, 'Expected one fully active Worker version.');
  const receipt = `Source: ${env.GITHUB_SHA}\nWorker version: ${latest.versions[0].version_id}\nTraffic enabled: ${health.trafficEnabled}\nEmail enabled: ${health.emailEnabled}\n`;
  console.log(receipt);
  if (env.GITHUB_STEP_SUMMARY) await appendFile(env.GITHUB_STEP_SUMMARY, receipt);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === 'prepare') await prepare(process.env);
  else if (process.argv[2] === 'verify') await verify(process.env);
  else throw new Error('Use prepare or verify. Neither command imports data or creates secrets.');
}
