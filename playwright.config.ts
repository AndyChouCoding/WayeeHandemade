import { defineConfig } from '@playwright/test';
import { readFileSync } from 'node:fs';

const fixturePath = process.env.E2E_LIVE_FIXTURE;
const fixture = fixturePath ? JSON.parse(readFileSync(fixturePath, 'utf8')) as { slug: string; apiUrl: string } : undefined;

export default defineConfig({
  testDir: './e2e', fullyParallel: false, workers: 1, timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3001', channel: 'chrome', trace: 'off', screenshot: 'off' },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1',
    url: 'http://127.0.0.1:3001/booking', timeout: 120_000, reuseExistingServer: false,
    env: { STUDIO_API_URL: fixture?.apiUrl ?? 'http://127.0.0.1:3000', STUDIO_TENANT_SLUG: fixture?.slug ?? 'wayee', STUDIO_ADMIN_URL: 'http://127.0.0.1:8080' },
  },
});
