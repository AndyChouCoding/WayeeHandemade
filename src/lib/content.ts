export type ContentKind = 'posts' | 'products';
export interface ContentEntry {
  id: string; kind: ContentKind; slug: string; title: string; category: string;
  excerpt: string; body: string; status: 'published';
  images: { id: string; url: string; contentType: string }[];
  priceAmount: number; currency: string; material: string; dimensions: string;
  productionTime: string; publishedAt: string | null;
}
export type ContentResult<T> = { data: T; error: null } | { data: null; error: 'unavailable' | 'not-found' };
type Environment = { STUDIO_API_URL?: string; STUDIO_TENANT_SLUG?: string };
/** Server-only callers provide configuration; no credentials or cookies are forwarded. */
export async function fetchContent<T>(kind: ContentKind, slug: string | undefined, env: Environment, fetcher: typeof fetch = fetch): Promise<ContentResult<T>> {
  try {
    if (!env.STUDIO_API_URL || !env.STUDIO_TENANT_SLUG || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(env.STUDIO_TENANT_SLUG)) throw new Error('Configuration');
    if (slug !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { data: null, error: 'not-found' };
    const base = new URL(env.STUDIO_API_URL);
    if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new Error('Configuration');
    const url = `${base.href.replace(/\/$/, '')}/public/${env.STUDIO_TENANT_SLUG}/content/${kind}${slug ? `/${encodeURIComponent(slug)}` : ''}`;
    const response = await fetcher(url, { cache: 'no-store', redirect: 'error', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return { data: null, error: response.status === 404 ? 'not-found' : 'unavailable' };
    return { data: await response.json() as T, error: null };
  } catch { return { data: null, error: 'unavailable' }; }
}
export function postView(entry: ContentEntry) {
  return { slug: entry.slug, date: entry.publishedAt ? new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei' }).format(new Date(entry.publishedAt)) : '', title: entry.title, tag: entry.category, excerpt: entry.excerpt, images: entry.images };
}
export function productView(entry: ContentEntry) {
  return { id: entry.slug, name: entry.title, category: entry.category, price: new Intl.NumberFormat('zh-TW', { style: 'currency', currency: entry.currency, maximumFractionDigits: entry.currency === 'USD' ? 2 : 0, minimumFractionDigits: entry.currency === 'USD' ? 2 : 0 }).format(entry.priceAmount / (entry.currency === 'USD' ? 100 : 1)), note: [entry.dimensions, entry.material].filter(Boolean).join('・'), images: entry.images };
}
