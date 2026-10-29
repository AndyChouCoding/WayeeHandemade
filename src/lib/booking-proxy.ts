const allowed: Record<string, { method: string; query: string[]; upstream: string }> = {
  studio: { method: 'GET', query: [], upstream: '' },
  services: { method: 'GET', query: [], upstream: '/services' },
  staff: { method: 'GET', query: ['serviceId'], upstream: '/staff' },
  availability: { method: 'GET', query: ['serviceId', 'staffId', 'from', 'to'], upstream: '/availability' },
  bookings: { method: 'POST', query: [], upstream: '/bookings' },
  manage: { method: 'POST', query: [], upstream: '/manage' },
  'manage/cancel': { method: 'POST', query: [], upstream: '/manage/cancel' },
};

const headers = { 'Cache-Control': 'no-store, private', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' };
const fail = (status: number, code: string) => Response.json({ code }, { status, headers });

/** Fixed public endpoints only. Never forward cookies, authorization, or untrusted client IP headers. */
export async function proxyBooking(request: Request, segments: string[], env: { STUDIO_API_URL?: string; STUDIO_TENANT_SLUG?: string }, fetcher: typeof fetch = fetch): Promise<Response> {
  const route = allowed[segments.join('/')];
  if (!route || !Object.hasOwn(allowed, segments.join('/'))) return fail(404, 'NOT_FOUND');
  if (request.method !== route.method) return fail(405, 'METHOD_NOT_ALLOWED');
  let upstream: URL;
  const incoming = new URL(request.url);
  try {
    if (!env.STUDIO_API_URL || !env.STUDIO_TENANT_SLUG || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(env.STUDIO_TENANT_SLUG)) throw new Error();
    const base = new URL(env.STUDIO_API_URL);
    if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new Error();
    upstream = new URL(`${base.href.replace(/\/$/, '')}/public/${env.STUDIO_TENANT_SLUG}${route.upstream}`);
  } catch { return fail(503, 'NOT_CONFIGURED'); }
  for (const [key, value] of incoming.searchParams) {
    if (!route.query.includes(key) || incoming.searchParams.getAll(key).length !== 1 || value.length > 100) return fail(400, 'INVALID_QUERY');
    upstream.searchParams.set(key, value);
  }
  let body: string | undefined;
  if (request.method === 'POST') {
    // Check Host as well because request.url can use the internal listener behind a reverse proxy.
    const origin = request.headers.get('origin');
    const host = request.headers.get('host') || incoming.host;
    try {
      if (request.headers.get('sec-fetch-site') === 'cross-site' || (origin && new URL(origin).host !== host)) return fail(403, 'INVALID_ORIGIN');
    } catch { return fail(403, 'INVALID_ORIGIN'); }
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return fail(415, 'JSON_REQUIRED');
    const reader = request.body?.getReader();
    if (!reader) return fail(400, 'INVALID_BODY');
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        if (size > 8192) { await reader.cancel(); return fail(413, 'BODY_TOO_LARGE'); }
        chunks.push(part.value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      body = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(body);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail(400, 'INVALID_BODY');
    } catch { return fail(400, 'INVALID_BODY'); }
  }
  try {
    const response = await fetcher(upstream, {
      method: request.method, headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15_000),
    });
    const data: unknown = await response.json();
    // Avoid exposing upstream errors or configuration details. Preserve the machine-readable code.
    if (!response.ok) {
      const code = data && typeof data === 'object' && 'code' in data && typeof data.code === 'string' ? data.code : 'REQUEST_FAILED';
      return fail(response.status >= 500 ? 502 : response.status, code);
    }
    return Response.json(data, { status: response.status, headers });
  } catch { return fail(502, 'UPSTREAM_UNAVAILABLE'); }
}
