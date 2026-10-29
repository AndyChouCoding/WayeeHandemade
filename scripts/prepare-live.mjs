import { randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const project = process.env.STUDIO_TEST_COMPOSE_PROJECT;
const repo = process.env.STUDIO_TEST_REPO;
const apiUrl = process.env.STUDIO_TEST_API_URL ?? 'http://127.0.0.1:3000';
if (!project || !/^studio_e2e_[a-z0-9_-]+$/.test(project) || !repo || !['127.0.0.1', 'localhost'].includes(new URL(apiUrl).hostname)) {
  throw new Error('Provide STUDIO_TEST_REPO, an isolated studio_e2e_* STUDIO_TEST_COMPOSE_PROJECT and localhost STUDIO_TEST_API_URL.');
}
// Verify this is an already-running isolated stack; never start or migrate another project.
const container = execFileSync('docker', ['compose', '-p', project, 'ps', '-q', 'api'], { cwd: repo, encoding: 'utf8' }).trim();
if (!container) throw new Error('The isolated API container is not running.');
const inspect = JSON.parse(execFileSync('docker', ['inspect', container], { encoding: 'utf8' }))[0];
const boundPort = inspect.NetworkSettings.Ports['3000/tcp']?.[0]?.HostPort;
if (String(new URL(apiUrl).port || '80') !== boundPort) throw new Error('API URL does not match the isolated container port.');
const suffix = randomBytes(5).toString('hex');
const password = randomBytes(24).toString('hex');
const email = `wayee-api-${suffix}@example.test`;
execFileSync('docker', ['compose', '-p', project, 'run', '--rm', '--no-deps', 'migrate', 'node', 'dist/db/scripts/seed-admin.js', '--email', email, '--password', password], { cwd: repo, stdio: 'pipe' });
async function api(endpoint, method = 'GET', body, token) {
  const r = await fetch(apiUrl + endpoint, { method, headers: { 'Content-Type': 'application/json', 'X-Studio-Client': 'web', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!r.ok) throw new Error(`${method} ${endpoint}: HTTP ${r.status}`);
  return r.status === 204 ? null : r.json();
}
const admin = await api('/auth/login', 'POST', { email, password });
const slug = `wayee-e2e-${suffix}`;
const ownerEmail = `owner-${suffix}@example.test`;
const tenant = await api('/platform/tenants', 'POST', { slug, name: '微雨 API 驗收（測試資料）', owner: { email: ownerEmail, name: 'Test Owner', password } }, admin.accessToken);
await api(`/platform/tenants/${tenant.id}/features/booking`, 'PUT', { enabled: true, reason: 'Wayee frontend acceptance' }, admin.accessToken);
const owner = await api('/auth/login', 'POST', { email: ownerEmail, password });
await api('/tenant/settings', 'PATCH', { timezone: 'Asia/Taipei', minLeadMinutes: 0, maxAdvanceDays: 30, cancelCutoffMinutes: 60, requireConfirmation: false, bookingNotificationsEnabled: false }, owner.accessToken);
const service = await api('/services', 'POST', { name: '羊毛氈體驗（驗收）', description: '僅供網站 API 串接驗收，非正式課程', durationMin: 60, priceAmount: 800 }, owner.accessToken);
const teacher = await api('/staff', 'POST', { displayName: '測試老師', serviceIds: [service.id] }, owner.accessToken);
await api(`/staff/${teacher.id}/working-hours`, 'PUT', { hours: Array.from({ length: 7 }, (_, weekday) => ({ weekday, start: '10:00', end: '17:00' })) }, owner.accessToken);
const date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
const file = path.resolve('docs/live-fixture.local.json');
mkdirSync(path.dirname(file), { recursive: true });
// Only public fixture metadata is persisted; admin credentials and tokens stay in memory.
writeFileSync(file, JSON.stringify({ slug, apiUrl, date, serviceId: service.id, staffId: teacher.id }, null, 2));
console.log(`Created isolated test tenant ${slug}. Fixture: ${file}`);
