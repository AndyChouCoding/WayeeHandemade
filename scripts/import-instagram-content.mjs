import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { articles, demoNotice, products, services } from './instagram-content-manifest.mjs';

const publish = process.argv.includes('--publish');
const apiUrl = process.env.STUDIO_API_URL;
const tenantSlug = process.env.STUDIO_TENANT_SLUG;
const email = process.env.E2E_OWNER_EMAIL;
const password = process.env.E2E_OWNER_PASSWORD;
const sourceDir = process.env.WAYEE_INSTAGRAM_SOURCE_DIR;

if (!apiUrl || !tenantSlug || !email || !password || !sourceDir) {
  throw new Error('Set STUDIO_API_URL, STUDIO_TENANT_SLUG, E2E_OWNER_EMAIL, E2E_OWNER_PASSWORD and WAYEE_INSTAGRAM_SOURCE_DIR.');
}
const base = new URL(apiUrl);
if (!['127.0.0.1', 'localhost'].includes(base.hostname) || !tenantSlug.startsWith('wayee-e2e-')) {
  throw new Error('This importer only writes to a localhost wayee-e2e-* tenant.');
}

const source = JSON.parse(await readFile(path.join(sourceDir, 'posts.json'), 'utf8'));
const sourcePosts = new Map(source.posts.map((post) => [post.id, post]));
const allContent = [...articles, ...products];
for (const item of [...allContent, ...services]) {
  if (!sourcePosts.has(item.sourceId)) throw new Error(`Missing source post ${item.sourceId}`);
}
for (const item of allContent) {
  const available = new Set(sourcePosts.get(item.sourceId).images.map((image) => image.filename));
  if (item.images.length > 8 || item.images.some((filename) => !available.has(filename))) throw new Error(`Invalid image selection for ${item.sourceId}`);
}

console.log(JSON.stringify({
  mode: publish ? 'publish' : 'dry-run',
  tenantSlug,
  articles: articles.length,
  products: products.length,
  services: services.length,
  selectedImages: allContent.reduce((count, item) => count + item.images.length, 0),
}, null, 2));
if (!publish) process.exit(0);

const headers = { 'Content-Type': 'application/json', 'X-Studio-Client': 'web' };
let accessToken = '';
async function request(route, { method = 'GET', body, authenticated = true } = {}) {
  const response = await fetch(new URL(route, base), {
    method,
    headers: { ...headers, ...(authenticated && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${method} ${route}: HTTP ${response.status} ${JSON.stringify(data)}`);
  return data;
}

const login = await request('/auth/login', { method: 'POST', body: { email, password, tenantSlug }, authenticated: false });
accessToken = login.accessToken;
const tenant = await request('/tenant');
if (tenant.slug !== tenantSlug) throw new Error(`Authenticated tenant mismatch: ${tenant.slug}`);

async function upload(route, filename) {
  const bytes = await readFile(path.join(sourceDir, 'images', filename));
  const form = await request(`${route}/uploads`, { method: 'POST', body: { contentType: 'image/jpeg', size: bytes.length } });
  const multipart = new FormData();
  for (const [name, value] of Object.entries(form.fields)) multipart.append(name, value);
  multipart.append('file', new Blob([bytes], { type: 'image/jpeg' }), filename);
  const response = await fetch(form.url, { method: 'POST', body: multipart, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Image upload ${filename}: HTTP ${response.status}`);
  return request(`${route}/uploads/${form.id}/complete`, { method: 'POST' });
}

function bodyFor(item) {
  const original = sourcePosts.get(item.sourceId);
  return `${item.lead}\n\n> ${demoNotice}\n\n## 工作室原始分享\n\n${original.caption}\n\n[查看 Instagram 原始貼文](${original.source_url})`;
}

async function upsertContent(kind, item) {
  const rows = await request(`/content/${kind}`);
  const existing = rows.find((row) => row.slug === item.slug);
  let imageIds = existing?.images?.map((image) => image.id) ?? [];
  if (!existing || imageIds.length !== item.images.length) {
    imageIds = [];
    for (const filename of item.images) imageIds.push((await upload('/content/images', filename)).id);
  }
  const input = {
    title: item.title,
    slug: item.slug,
    category: item.category,
    excerpt: item.excerpt,
    body: bodyFor(item),
    imageIds,
    priceAmount: item.priceAmount ?? 0,
    currency: 'TWD',
    material: item.material ?? '',
    dimensions: item.dimensions ?? '',
    productionTime: item.productionTime ?? '',
  };
  const saved = await request(`/content/${kind}${existing ? `/${existing.id}` : ''}`, { method: existing ? 'PUT' : 'POST', body: input });
  await request(`/content/${kind}/${saved.id}/status`, { method: 'PUT', body: { status: 'published' } });
  console.log(`${existing ? 'Updated' : 'Created'} ${kind}: ${item.slug}`);
}

for (const item of articles) await upsertContent('posts', item);
for (const item of products) await upsertContent('products', item);

const existingServices = await request('/services');
const serviceIds = [];
for (const item of services) {
  const existing = existingServices.find((service) => service.name === item.name);
  const input = { name: item.name, description: item.description, durationMin: item.durationMin, bufferBeforeMin: 0, bufferAfterMin: 0, priceAmount: item.priceAmount, active: true };
  const saved = await request(`/services${existing ? `/${existing.id}` : ''}`, { method: existing ? 'PATCH' : 'POST', body: input });
  if (!existing) await upload(`/services/${saved.id}/image`, item.image);
  serviceIds.push(saved.id);
  console.log(`${existing ? 'Updated' : 'Created'} service: ${item.name}`);
}

const staffRows = await request('/staff');
const existingTeacher = staffRows.find((staff) => staff.displayName === '微雨老師');
const teacherInput = { displayName: '微雨老師', title: '示範授課老師', userId: null, active: true, serviceIds };
const teacher = await request(`/staff${existingTeacher ? `/${existingTeacher.id}` : ''}`, { method: existingTeacher ? 'PATCH' : 'POST', body: teacherInput });
await request(`/staff/${teacher.id}/working-hours`, {
  method: 'PUT',
  body: { hours: Array.from({ length: 7 }, (_, weekday) => ({ weekday, start: '10:00', end: '17:00' })) },
});
console.log(`Published demo content to ${tenantSlug}.`);
