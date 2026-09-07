import { createAuth, origins, sendEmail } from './auth.mjs';

const authPaths = new Set(['get-session', 'sign-up/email', 'sign-in/email', 'sign-out', 'email-otp/send-verification-otp',
  'email-otp/verify-email', 'email-otp/request-password-reset', 'email-otp/reset-password']);
const json = (body, status = 200) => Response.json(body, { status });
const problem = (status, message) => Object.assign(new Error(message), { status });

async function body(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw problem(415, 'JSON is required.');
  const reader = request.body?.getReader();
  const chunks = [];
  let size = 0;
  if (reader) while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { void reader.cancel(); throw problem(413, 'Request is too large.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  const raw = new TextDecoder().decode(bytes);
  try { const value = JSON.parse(raw); if (!value || Array.isArray(value) || typeof value !== 'object') throw Error(); return value; }
  catch { throw problem(400, 'Invalid JSON.'); }
}
function text(value, name, max, optional = false) {
  if (optional && value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw problem(400, `${name} is invalid.`);
  return value.trim();
}
async function contactLimit(request, env) {
  if (!env.AUTH_SECRET || env.AUTH_SECRET.length < 32) throw problem(503, 'Contact delivery is not configured.');
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip) throw problem(503, 'Contact delivery is temporarily unavailable.');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${env.AUTH_SECRET}:${ip}`));
  const key = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  const window = Math.floor(Date.now() / 900000);
  const row = await env.DB.prepare(`INSERT INTO contact_rate_limit (key, window, count) VALUES (?, ?, 1)
    ON CONFLICT(key) DO UPDATE SET window=excluded.window, count=CASE WHEN contact_rate_limit.window=excluded.window THEN contact_rate_limit.count+1 ELSE 1 END RETURNING count`).bind(key, window).first();
  if (row.count > 5) throw problem(429, 'Please wait before sending another message.');
  await env.DB.prepare('DELETE FROM contact_rate_limit WHERE window < ?').bind(window - 1).run();
}

async function handle(request, env) {
  const path = new URL(request.url).pathname;
  if (!env.DB) throw problem(503, 'Service is not configured.');
  const gate = await env.DB.prepare('SELECT writes_enabled FROM migration_control WHERE id=1').first();
  const writesEnabled = gate?.writes_enabled === 1;
  if (path === '/api/health' && request.method === 'GET') {
    return json({ releaseSha: env.RELEASE_SHA ?? null, trafficEnabled: env.TRAFFIC_ENABLED === 'true', emailEnabled: env.EMAIL_ENABLED === 'true', writesEnabled, authConfigured: Boolean(env.AUTH_SECRET?.length >= 32) });
  }
  // Session GETs can refresh persistent sessions. A data fence must stop reads too.
  if (env.TRAFFIC_ENABLED !== 'true' || !writesEnabled) throw problem(503, 'Service is paused for maintenance. Please try again shortly.');
  if (path.startsWith('/api/auth/')) {
    const endpoint = path.slice('/api/auth/'.length);
    if (!authPaths.has(endpoint)) throw problem(404, 'Not found.');
    if (request.method !== (endpoint === 'get-session' ? 'GET' : 'POST')) throw problem(405, 'Method not allowed.');
    if (request.method === 'POST') {
      if (endpoint !== 'sign-out' && (env.EMAIL_ENABLED !== 'true' || !env.EMAIL?.send || !env.EMAIL_FROM)) throw problem(503, 'Account email service is not configured.');
      const payload = await body(request);
      if (endpoint === 'email-otp/send-verification-otp' && payload.type !== 'email-verification') throw problem(400, 'Unsupported verification request.');
      const headers = new Headers(request.headers);
      headers.delete('content-length');
      request = new Request(request.url, { method: request.method, headers, body: JSON.stringify(payload) });
    }
    return createAuth(env).handler(request);
  }
  if (request.method === 'GET' && ['/api/products', '/api/variants'].includes(path)) {
    const table = path === '/api/products' ? 'products' : 'product_variants';
    const rows = await env.DB.prepare(`SELECT data FROM ${table} ORDER BY id`).all();
    return json({ data: rows.results.map(row => JSON.parse(row.data)) });
  }
  if (path === '/api/contact' && request.method === 'POST') {
    await contactLimit(request, env);
    const input = await body(request);
    const name = text(input.name, 'Name', 120);
    const email = text(input.email, 'Email', 254).toLowerCase();
    const message = text(input.message, 'Message', 5000);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw problem(400, 'Email is invalid.');
    if (!env.CONTACT_TO_EMAIL) throw problem(503, 'Contact delivery is not configured.');
    await sendEmail(env, { to: env.CONTACT_TO_EMAIL, replyTo: email, subject: 'New VinoVeil concierge message', text: `Name: ${name}\nEmail: ${email}\n\n${message}` });
    return json({ data: { ok: true } });
  }
  const session = await createAuth(env).api.getSession({ headers: request.headers });
  if (!session?.user?.emailVerified) throw problem(401, 'Please sign in.');
  const user = session.user;
  const admin = user.role === 'admin';
  if (path === '/api/me' && request.method === 'GET') return json({ data: { username: user.id, email: user.email, groups: admin ? ['ADMINS'] : [] } });
  if (path === '/api/orders' && request.method === 'GET') {
    const rows = await (admin ? env.DB.prepare('SELECT data FROM orders ORDER BY id') : env.DB.prepare('SELECT data FROM orders WHERE owner_id=? ORDER BY id').bind(user.id)).all();
    return json({ data: rows.results.map(row => JSON.parse(row.data)) });
  }
  if (path === '/api/profile' && request.method === 'GET') {
    const row = await env.DB.prepare('SELECT data FROM user_profiles WHERE owner_id=?').bind(user.id).first();
    return json({ data: row ? JSON.parse(row.data) : null });
  }
  if (path === '/api/profile' && request.method === 'PUT') {
    const input = await body(request);
    if (Object.keys(input).some(key => !['fullName', 'defaultShippingAddress', 'marketingOptIn'].includes(key))) throw problem(400, 'Unsupported profile field.');
    if (input.marketingOptIn !== undefined && typeof input.marketingOptIn !== 'boolean') throw problem(400, 'Invalid marketing preference.');
    if (input.defaultShippingAddress !== undefined && (!input.defaultShippingAddress || Array.isArray(input.defaultShippingAddress) || typeof input.defaultShippingAddress !== 'object')) throw problem(400, 'Invalid shipping address.');
    const data = { owner: user.id, email: user.email, fullName: text(input.fullName, 'Full name', 120, true), defaultShippingAddress: input.defaultShippingAddress, marketingOptIn: input.marketingOptIn ?? false };
    await env.DB.prepare('INSERT INTO user_profiles(owner_id, data) VALUES(?,?) ON CONFLICT(owner_id) DO UPDATE SET data=excluded.data').bind(user.id, JSON.stringify(data)).run();
    return json({ data });
  }
  if (path === '/api/admin/profiles' && request.method === 'GET') {
    if (!admin) throw problem(403, 'Administrator access required.');
    const rows = await env.DB.prepare('SELECT data FROM user_profiles ORDER BY owner_id').all();
    return json({ data: rows.results.map(row => JSON.parse(row.data)) });
  }
  if (path === '/api/admin' && request.method === 'GET') {
    if (!admin) throw problem(403, 'Administrator access required.');
    return json({ data: { groups: ['ADMINS'], productManagementAvailable: false } });
  }
  if (path === '/api/admin/contacts' && request.method === 'GET') {
    if (!admin) throw problem(403, 'Administrator access required.');
    const rows = await env.DB.prepare('SELECT data FROM contact_messages ORDER BY id').all();
    return json({ data: rows.results.map(row => JSON.parse(row.data)) });
  }
  if (['/api/orders/draft', '/api/checkout'].includes(path) && request.method === 'POST') throw problem(501, 'Checkout is not available yet. No order or payment was created.');
  throw problem(404, 'Not found.');
}

export default {
  async fetch(request, env) {
    let allowed;
    const origin = request.headers.get('origin');
    let response;
    try {
      allowed = origins(env);
      if ((origin && !allowed.includes(origin)) || (!['GET', 'HEAD'].includes(request.method) && !allowed.includes(origin))) throw problem(403, 'Untrusted request origin.');
      response = request.method === 'OPTIONS' ? new Response(null, { status: 204 }) : await handle(request, env);
    } catch (error) {
      response = json({ error: error.status ? error.message : 'Service is temporarily unavailable.' }, error.status || 503);
    }
    response = new Response(response.body, response);
    response.headers.set('cache-control', 'no-store');
    response.headers.set('vary', 'Origin');
    response.headers.set('x-content-type-options', 'nosniff');
    if (allowed?.includes(origin)) {
      response.headers.set('access-control-allow-origin', origin);
      response.headers.set('access-control-allow-credentials', 'true');
      response.headers.set('access-control-allow-methods', 'GET,POST,PUT,OPTIONS');
      response.headers.set('access-control-allow-headers', 'content-type');
    }
    return response;
  },
};
