/** Serve the existing admin HTML without framing it or relaxing its security policy. */
export async function adminPage(adminUrl: string | undefined, fetcher: typeof fetch = fetch): Promise<Response> {
  const unavailable = () => new Response('<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><title>商家後台</title><body><h1>商家後台暫時無法使用</h1><p>請確認後台服務已啟動，再重新整理。</p><a href="/">返回網站</a></body></html>', {
    status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'" },
  });
  try {
    if (!adminUrl) return unavailable();
    const origin = new URL(adminUrl);
    if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) return unavailable();
    const response = await fetcher(origin, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10_000) });
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return unavailable();
    const html = await response.text();
    if (!/<body(?:\s[^>]*)?>/i.test(html)) return unavailable();
    const navigation = '<nav aria-label="網站切換" style="padding:12px 24px;background:#E3EEF6;border-bottom:1px solid #B9CEDE;font-family:sans-serif"><a href="/" style="display:inline-flex;align-items:center;min-height:44px;color:#1E2833;text-decoration:none">← 返回網站</a></nav>';
    const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    for (const key of ['content-security-policy', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy']) {
      const value = response.headers.get(key);
      if (value) headers.set(key, value);
    }
    // Only add a navigation landmark outside React's root; bundles and auth behavior stay intact.
    return new Response(html.replace(/<body(?:\s[^>]*)?>/i, (body) => body + navigation), { headers });
  } catch { return unavailable(); }
}
