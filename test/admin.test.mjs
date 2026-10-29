import assert from 'node:assert/strict';
import { test } from 'node:test';
import { adminPage } from '../src/lib/admin-page.ts';

test('admin adds a return link outside app root and preserves upstream CSP', async () => {
  const policy = "default-src 'self'; frame-ancestors 'none'";
  const r = await adminPage('http://localhost:8080', async (_url, options) => {
    assert.equal(options.cache, 'no-store');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers, undefined);
    return new Response('<html><body class="admin"><div id="root"></div><script src="/assets/main.js"></script></body></html>', { headers: { 'content-type': 'text/html', 'content-security-policy': policy, 'x-frame-options': 'DENY', 'content-encoding': 'gzip' } });
  });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-security-policy'), policy);
  assert.equal(r.headers.get('x-frame-options'), 'DENY');
  assert.equal(r.headers.get('content-encoding'), null);
  const html = await r.text();
  assert.ok(html.indexOf('返回網站') < html.indexOf('<div id="root">'));
  assert.match(html, /src="\/assets\/main.js"/);
});

test('admin safely fails on invalid config, network failures or unexpected upstream content', async () => {
  for (const url of [undefined, 'file:///tmp/admin', 'http://user:password@localhost:8080', 'http://localhost:8080/path']) {
    assert.equal((await adminPage(url)).status, 503);
  }
  for (const fetcher of [async () => { throw new Error('private host'); }, async () => Response.json({}), async () => new Response('broken', { headers: { 'content-type': 'text/html' } })]) {
    const r = await adminPage('http://localhost:8080', fetcher);
    assert.equal(r.status, 503);
    assert.doesNotMatch(await r.text(), /private host/);
  }
});
