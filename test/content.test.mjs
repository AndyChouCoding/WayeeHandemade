import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchContent, productView } from '../src/lib/content.ts';
import { inlineMarkdown } from '../src/lib/markdown.ts';
const env = { STUDIO_API_URL: 'http://127.0.0.1:3100', STUDIO_TENANT_SLUG: 'rain' };
test('content requests are tenant-scoped and never cached or authenticated', async () => {
  let call;
  const result = await fetchContent('posts', 'story', env, async (url, options) => { call = { url, options }; return Response.json({ title: 'Story' }); });
  assert.equal(result.data.title, 'Story');
  assert.equal(call.url, 'http://127.0.0.1:3100/public/rain/content/posts/story');
  assert.equal(call.options.cache, 'no-store');
  assert.equal(call.options.redirect, 'error');
  assert.deepEqual(call.options.headers, { Accept: 'application/json' });
});
test('content distinguishes missing pages from unavailable backends and rejects bad config', async () => {
  assert.equal((await fetchContent('posts', 'missing', env, async () => new Response('', { status: 404 }))).error, 'not-found');
  for (const fetcher of [async () => new Response('', { status: 500 }), async () => { throw Error('offline'); }, async () => new Response('not json')]) {
    assert.equal((await fetchContent('products', undefined, env, fetcher)).error, 'unavailable');
  }
  const unexpected = async () => { assert.fail('must not request invalid destination'); };
  assert.equal((await fetchContent('posts', '../private', env, unexpected)).error, 'not-found');
  assert.equal((await fetchContent('posts', undefined, { ...env, STUDIO_API_URL: 'http://user:pass@localhost/' }, unexpected)).error, 'unavailable');
  assert.equal((await fetchContent('posts', undefined, {}, unexpected)).error, 'unavailable');
});
test('Markdown exposes only http(s) links and never emits HTML nodes', () => {
  const parts = inlineMarkdown('**重要** [安全](https://example.test/) <script>alert(1)</script> [危險](javascript:alert)');
  assert.equal(parts.find((p) => p.type === 'strong').text, '重要');
  assert.equal(parts.filter((p) => p.type === 'link').length, 1);
  assert.ok(parts.some((p) => p.type === 'text' && p.text.includes('<script>')));
  for (const href of ['javascript:alert', 'data:text/html,test', '//evil.test', '/admin']) assert.equal(inlineMarkdown(`[test](${href})`)[0].type, 'text');
});
test('product prices follow platform integer TWD/JPY and USD cents', () => {
  const entry = { slug: 'cup', title: 'Cup', category: '', dimensions: '', material: '', images: [] };
  assert.match(productView({ ...entry, priceAmount: 1200, currency: 'TWD' }).price, /1,200/);
  assert.match(productView({ ...entry, priceAmount: 1999, currency: 'USD' }).price, /19.99/);
  assert.match(productView({ ...entry, priceAmount: 500, currency: 'JPY' }).price, /500/);
});
