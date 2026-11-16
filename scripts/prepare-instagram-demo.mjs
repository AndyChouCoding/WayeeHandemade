import { randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

if (!process.argv.includes('--create')) throw new Error('Pass --create to create a new local demo tenant.');
const repo = process.env.STUDIO_TEST_REPO;
const project = process.env.STUDIO_TEST_COMPOSE_PROJECT;
const apiUrl = process.env.STUDIO_TEST_API_URL ?? 'http://127.0.0.1:3000';
const composeOverride = process.env.STUDIO_TEST_COMPOSE_OVERRIDE ?? 'docs/local-credentials.compose.yml';
const credentialsFile = path.resolve(process.env.STUDIO_TEST_CREDENTIALS_FILE ?? '.env.instagram-demo.local');
const fixtureFile = path.resolve(process.env.STUDIO_TEST_FIXTURE_FILE ?? 'docs/instagram-demo-fixture.local.json');
const api = new URL(apiUrl);
if (!repo || project !== 'andystudio' || !['127.0.0.1', 'localhost'].includes(api.hostname) || !existsSync(path.resolve(repo, composeOverride))) {
  throw new Error('Use the local andystudio Compose project, STUDIO_TEST_REPO and a localhost API URL.');
}
if (existsSync(credentialsFile) || existsSync(fixtureFile)) throw new Error('Refusing to overwrite an existing demo credentials or fixture file.');

const compose = ['compose', '-f', 'docker-compose.yml', '-f', composeOverride, '-p', project];
const container = execFileSync('docker', [...compose, 'ps', '-q', 'api'], { cwd: repo, encoding: 'utf8' }).trim();
if (!container) throw new Error('The local API container is not running.');
const inspect = JSON.parse(execFileSync('docker', ['inspect', container], { encoding: 'utf8' }))[0];
const configFiles = inspect.Config.Labels?.['com.docker.compose.project.config_files'] ?? '';
const bound = inspect.NetworkSettings.Ports['3000/tcp']?.[0];
if (configFiles.includes('docker-compose.prod.yml') || !configFiles.includes('docker-compose.yml') || bound?.HostIp !== '127.0.0.1' || bound?.HostPort !== (api.port || '80')) {
  throw new Error('Refusing a production, non-loopback or mismatched Compose API.');
}

const suffix = randomBytes(5).toString('hex');
const platformEmail = `instagram-platform-${suffix}@example.test`;
const platformPassword = randomBytes(24).toString('hex');
const ownerEmail = `instagram-owner-${suffix}@example.test`;
const ownerPassword = randomBytes(24).toString('hex');
execFileSync('docker', [...compose, 'run', '--rm', '--no-deps', 'migrate', 'node', 'dist/db/scripts/seed-admin.js', '--email', platformEmail, '--password', platformPassword], { cwd: repo, stdio: 'pipe' });

async function request(route, { method = 'GET', body, token } = {}) {
  const response = await fetch(new URL(route, api), {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Studio-Client': 'web', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${method} ${route}: HTTP ${response.status}`);
  return data;
}

const platform = await request('/auth/login', { method: 'POST', body: { email: platformEmail, password: platformPassword } });
const slug = `wayee-e2e-instagram-${suffix}`;
const tenant = await request('/platform/tenants', {
  method: 'POST',
  token: platform.accessToken,
  body: { slug, name: '微雨漫作 IG 內容驗收（示範）', owner: { email: ownerEmail, name: 'Instagram Demo Owner', password: ownerPassword } },
});
for (const feature of ['booking', 'storefront']) {
  await request(`/platform/tenants/${tenant.id}/features/${feature}`, {
    method: 'PUT', token: platform.accessToken, body: { enabled: true, reason: 'Approved Instagram content demo' },
  });
}
const owner = await request('/auth/login', { method: 'POST', body: { email: ownerEmail, password: ownerPassword, tenantSlug: slug } });
await request('/tenant/settings', {
  method: 'PATCH', token: owner.accessToken,
  body: { timezone: 'Asia/Taipei', currency: 'TWD', minLeadMinutes: 0, maxAdvanceDays: 30, cancelCutoffMinutes: 60, requireConfirmation: false, bookingNotificationsEnabled: false },
});

mkdirSync(path.dirname(credentialsFile), { recursive: true });
mkdirSync(path.dirname(fixtureFile), { recursive: true });
writeFileSync(credentialsFile, `E2E_OWNER_EMAIL=${ownerEmail}\nE2E_OWNER_PASSWORD=${ownerPassword}\n`, { mode: 0o600, flag: 'wx' });
writeFileSync(fixtureFile, JSON.stringify({ slug, apiUrl, tenantId: tenant.id, createdAt: new Date().toISOString() }, null, 2), { flag: 'wx' });
console.log(`Created local Instagram demo tenant ${slug}.`);
console.log(`Fixture: ${fixtureFile}`);
console.log(`Credentials: ${credentialsFile} (0600, ignored)`);
