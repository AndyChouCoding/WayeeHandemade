import { defineConfig } from '@playwright/test';
import { readFileSync } from 'node:fs';

const fixturePath = process.env.E2E_LIVE_FIXTURE;
const fixture = fixturePath ? JSON.parse(readFileSync(fixturePath, 'utf8')) as { slug: string; apiUrl: string } : undefined;

const port = process.env.E2E_PORT ?? '3001';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e', fullyParallel: false, workers: 1, timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: 'list',
  use: { baseURL, channel: 'chrome', trace: 'off', screenshot: 'off' },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/booking`, timeout: 120_000, reuseExistingServer: false,
    env: { STUDIO_API_URL: fixture?.apiUrl ?? process.env.STUDIO_API_URL ?? 'http://127.0.0.1:3000', STUDIO_TENANT_SLUG: fixture?.slug ?? process.env.STUDIO_TENANT_SLUG ?? 'wayee', STUDIO_ADMIN_URL: process.env.STUDIO_ADMIN_URL ?? 'http://127.0.0.1:8080' },
  },
});
