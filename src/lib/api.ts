const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

/** Same-site API cookies stay HTTP-only; no tokens are stored in browser storage. */
export async function apiRequest<T>(path: string, body?: unknown, method = body === undefined ? 'GET' : 'POST'): Promise<T> {
  if (!base) throw new Error('This service is not configured yet.');
  const url = new URL(base);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Service configuration is invalid.');
  const response = await fetch(`${base}${path}`, {
    method, credentials: 'include',
    ...(body === undefined ? {} : { headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message ?? result.error ?? result.message ?? 'The request could not be completed.');
  return result as T;
}
