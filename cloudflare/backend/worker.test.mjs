import assert from 'node:assert/strict';
import { before, after, beforeEach, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { getMigrations } from 'better-auth/db/migration';
import { testPlatform } from './test-platform.mjs';
import { authOptions } from './auth.mjs';
import worker from './worker.mjs';

let platform, env;
const emails = [];
const password = 'Offline-only-password-17!';
before(async () => {
  platform = await testPlatform();
  env = { ...platform.env, AUTH_SECRET: 'offline-test-secret-never-used-in-production-0123456789', EMAIL_ENABLED: 'true', EMAIL_FROM: 'noreply@example.invalid', CONTACT_TO_EMAIL: 'owner@example.invalid',
    EMAIL: { async send(message) { emails.push(message); return { messageId: 'offline-delivery' }; } } };
  for (const file of ['0001_auth.sql', '0002_data.sql']) {
    const sql = (await readFile(new URL(`./migrations/${file}`, import.meta.url), 'utf8')).replace(/^--.*$/gm, '');
    for (const statement of sql.split(';').map(value => value.trim()).filter(Boolean)) await env.DB.prepare(statement).run();
  }
});
after(async () => { await platform?.dispose(); });
beforeEach(async () => {
  for (const table of ['orders', 'user_profiles', 'contact_messages', 'product_variants', 'products', 'session', 'account', 'verification', 'rateLimit', 'contact_rate_limit', 'user']) await env.DB.prepare(`DELETE FROM "${table}"`).run();
  emails.length = 0;
});
async function call(path, { method = 'GET', payload, cookie, bindings = env, origin = 'https://vinoveil.com', ip = '192.0.2.1' } = {}) {
  const headers = { origin, 'cf-connecting-ip': ip, 'content-type': 'application/json', ...(cookie ? { cookie } : {}) };
  const response = await worker.fetch(new Request(`https://api.vinoveil.com${path}`, { method, headers, ...(payload === undefined ? {} : { body: JSON.stringify(payload) }) }), bindings);
  const raw = await response.text();
  return { status: response.status, body: raw ? JSON.parse(raw) : null, headers: response.headers,
    cookie: response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ') };
}
const post = (path, payload, extra = {}) => call(path, { method: 'POST', payload, ...extra });
const latestCode = () => emails.at(-1).text.match(/code is (\d{6})/)[1];
async function account(email) {
  assert.equal((await post('/api/auth/sign-up/email', { email, password, name: email, role: 'admin' })).status, 200);
  assert.equal((await post('/api/auth/email-otp/verify-email', { email, otp: latestCode() })).status, 200);
  const login = await post('/api/auth/sign-in/email', { email, password });
  assert.equal(login.status, 200);
  const me = await call('/api/me', { cookie: login.cookie });
  assert.equal(me.status, 200);
  return { ...me.body.data, cookie: login.cookie, headers: login.headers };
}

test('real email/password verification, secure cookies, role-input denial and logout invalidation', async () => {
  const user = await account('first@example.invalid');
  assert.deepEqual(user.groups, []);
  const cookies = user.headers.getSetCookie().join(';');
  assert.match(cookies, /HttpOnly/i); assert.match(cookies, /Secure/i); assert.match(cookies, /SameSite=Lax/i);
  const stored = await env.DB.prepare('SELECT password FROM account').first();
  assert.notEqual(stored.password, password);
  assert.equal((await call('/api/admin', { cookie: user.cookie })).status, 403);
  assert.equal((await post('/api/auth/sign-out', {}, { cookie: user.cookie })).status, 200);
  assert.equal((await call('/api/me', { cookie: user.cookie })).status, 401);
  assert.equal((await post('/api/auth/sign-in/email-otp', { email: user.email, otp: '000000' })).status, 404);
});

test('unverified login is denied, OTP is hashed and single-use, password reset revokes sessions', async () => {
  const email = 'reset@example.invalid';
  assert.equal((await post('/api/auth/sign-up/email', { email, password, name: 'Offline reset' })).status, 200);
  assert.equal((await post('/api/auth/sign-in/email', { email, password })).status, 403);
  const otp = latestCode();
  const verification = await env.DB.prepare('SELECT value FROM verification').all();
  assert(verification.results.every(row => !row.value.includes(otp)));
  assert.equal((await post('/api/auth/email-otp/verify-email', { email, otp })).status, 200);
  assert.notEqual((await post('/api/auth/email-otp/verify-email', { email, otp })).status, 200);
  const session = await post('/api/auth/sign-in/email', { email, password });
  assert.equal(session.status, 200);
  assert.equal((await post('/api/auth/email-otp/request-password-reset', { email })).status, 200);
  assert.equal((await post('/api/auth/email-otp/reset-password', { email, otp: latestCode(), password: password + 'new' })).status, 200);
  assert.equal((await call('/api/me', { cookie: session.cookie })).status, 401);
  assert.equal((await post('/api/auth/sign-in/email', { email, password })).status, 401);
  assert.equal((await post('/api/auth/sign-in/email', { email, password: password + 'new' }, { ip: '192.0.2.2' })).status, 200);
});

test('guest catalog and contact preserve empty/delivery-failure truth and origin controls', async () => {
  for (const path of ['/api/products', '/api/variants']) assert.deepEqual((await call(path)).body, { data: [] });
  assert.equal((await call('/api/orders')).status, 401);
  assert.equal((await call('/api/admin/contacts')).status, 401);
  const payload = { name: 'Offline guest', email: 'guest@example.invalid', message: 'Offline only' };
  assert.deepEqual((await post('/api/contact', payload)).body, { data: { ok: true } });
  assert.equal(emails.length, 1);
  assert.equal((await post('/api/contact', payload, { bindings: { ...env, EMAIL: { async send() { throw new Error('offline delivery failure'); } } } })).status, 503);
  assert.equal((await post('/api/contact', payload, { origin: 'https://untrusted.invalid' })).status, 403);
  assert.equal((await post('/api/contact', payload, { origin: '' })).status, 403);
  assert.equal((await post('/api/auth/sign-up/email', { email: 'blocked@example.invalid', password, name: 'Offline' }, { origin: 'https://untrusted.invalid' })).status, 403);
  assert.equal((await post('/api/auth/sign-up/email', { email: 'large@example.invalid', password, name: 'x'.repeat(20000) })).status, 413);
  const options = await call('/api/contact', { method: 'OPTIONS', origin: 'https://www.vinoveil.com' });
  assert.equal(options.status, 204); assert.equal(options.headers.get('access-control-allow-origin'), 'https://www.vinoveil.com');
  assert.equal(options.headers.get('access-control-allow-credentials'), 'true');
});

test('owner order/profile separation and admin read gate come from verified server sessions', async () => {
  const first = await account('owner-a@example.invalid');
  const second = await account('owner-b@example.invalid');
  for (const user of [first, second]) {
    await env.DB.prepare('INSERT INTO orders (id, owner_id, data) VALUES (?,?,?)').bind(user.username, user.username, JSON.stringify({ id: user.username, email: user.email })).run();
    assert.equal((await call('/api/profile', { method: 'PUT', payload: { fullName: 'Offline owner' }, cookie: user.cookie })).status, 200);
  }
  const own = await call(`/api/orders?owner_id=${second.username}`, { cookie: first.cookie });
  assert.deepEqual(own.body.data.map(order => order.id), [first.username]);
  assert.equal((await call('/api/profile', { cookie: first.cookie })).body.data.owner, first.username);
  assert.equal((await call('/api/profile', { method: 'PUT', cookie: first.cookie, payload: { owner: second.username } })).status, 400);
  assert.equal((await call('/api/admin/profiles', { cookie: first.cookie })).status, 403);
  await env.DB.prepare("UPDATE user SET role='admin' WHERE id=?").bind(first.username).run();
  assert.deepEqual((await call('/api/me', { cookie: first.cookie })).body.data.groups, ['ADMINS']);
  assert.equal((await call('/api/orders', { cookie: first.cookie })).body.data.length, 2);
  assert.equal((await call('/api/admin/profiles', { cookie: first.cookie })).body.data.length, 2);
  assert.equal((await post('/api/orders/draft', {}, { cookie: second.cookie })).status, 501);
  assert.equal((await post('/api/checkout', {}, { cookie: second.cookie })).status, 501);
  assert.equal((await env.DB.prepare('SELECT count(*) AS n FROM orders').first()).n, 2);
});

test('rate limits persist across auth instances and contact delivery attempts', async () => {
  for (let i = 0; i < 3; i++) assert.equal((await post('/api/auth/email-otp/request-password-reset', { email: 'absent@example.invalid' })).status, 200);
  assert.equal((await post('/api/auth/email-otp/request-password-reset', { email: 'absent@example.invalid' })).status, 429);
  const payload = { name: 'Offline limited', email: 'limited@example.invalid', message: 'Offline only' };
  for (let i = 0; i < 5; i++) assert.equal((await post('/api/contact', payload)).status, 200);
  assert.equal((await post('/api/contact', payload)).status, 429);
  assert.equal(emails.length, 5);
  assert.notEqual((await env.DB.prepare('SELECT key FROM contact_rate_limit').first()).key, '192.0.2.1');
});

test('pinned schema is complete, ownership keys enforce referential integrity and configuration failures stay errors', async () => {
  const migration = await getMigrations(authOptions(env));
  assert.equal(migration.toBeCreated.length, 0); assert.equal(migration.toBeAdded.length, 0);
  await assert.rejects(env.DB.prepare("INSERT INTO orders VALUES ('bad','missing','{\"id\":\"bad\"}')").run());
  assert.equal((await call('/api/products', { bindings: { ...env, DB: undefined } })).status, 503);
  assert.equal((await post('/api/contact', { name: 'Offline', email: 'test@example.invalid', message: 'Offline' }, { bindings: { ...env, EMAIL_ENABLED: 'false' } })).status, 503);
});

test('failed verification delivery cannot authenticate; resend recovers the unverified account', async () => {
  const email = 'delivery-retry@example.invalid';
  const failed = { ...env, EMAIL: { async send() { throw new Error('offline delivery failure'); } } };
  // Better Auth reports account creation independently of verification delivery.
  assert.equal((await post('/api/auth/sign-up/email', { email, password, name: 'Offline delivery' }, { bindings: failed })).status, 200);
  const stored = await env.DB.prepare('SELECT emailVerified FROM user WHERE email=?').bind(email).first();
  assert.equal(stored.emailVerified, 0);
  assert.equal((await post('/api/auth/sign-in/email', { email, password }, { bindings: failed })).status, 403);
  assert.equal((await post('/api/auth/email-otp/send-verification-otp', { email, type: 'email-verification' })).status, 200);
  assert.equal((await post('/api/auth/email-otp/verify-email', { email, otp: latestCode() })).status, 200);
  assert.equal((await post('/api/auth/sign-in/email', { email, password })).status, 200);
  const count = (await env.DB.prepare('SELECT count(*) AS n FROM user').first()).n;
  assert.equal((await post('/api/auth/sign-up/email', { email: 'disabled@example.invalid', password, name: 'Offline disabled' }, { bindings: { ...env, EMAIL_ENABLED: 'false' } })).status, 503);
  assert.equal((await env.DB.prepare('SELECT count(*) AS n FROM user').first()).n, count);
});
