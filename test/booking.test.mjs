import assert from 'node:assert/strict';
import { test } from 'node:test';
import { proxyBooking } from '../src/lib/booking-proxy.ts';
import { addDays, bookingNote, formatPrice, localDate } from '../src/lib/booking.ts';

const env = { STUDIO_API_URL: 'http://localhost:3000', STUDIO_TENANT_SLUG: 'wayee' };
const request = (path, options) => new Request('http://localhost:3001/api/booking/' + path, options);
const post = (body, headers = {}) => ({ method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
test('formats whole-dollar TWD and minor-unit USD correctly', () => {
  assert.match(formatPrice(800, 'TWD'), /800/);
  assert.match(formatPrice(1234, 'USD'), /12\.34/);
});
test('calendar dates follow tenant time zone across UTC midnight and month rollover', () => {
  assert.equal(localDate(new Date('2026-10-31T23:30:00Z'), 'Asia/Taipei'), '2026-11-01');
  assert.equal(localDate(new Date('2026-10-31T23:30:00Z'), 'America/Los_Angeles'), '2026-10-31');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});
test('people are bounded integer notes, not booked capacity', () => {
  assert.match(bookingNote(3, '親子'), /需求人數：3 人.*待工作室確認/);
  for (const n of [0, -1, 1.2, NaN, 1000]) assert.throws(() => bookingNote(n, ''));
  assert.throws(() => bookingNote(1, 'x'.repeat(1000)));
});
test('proxy only calls configured public tenant and does not forward credentials or client IP', async () => {
  const r = await proxyBooking(request('staff?serviceId=abc', { headers: { cookie: 'secret', authorization: 'secret', 'x-forwarded-for': 'spoof' } }), ['staff'], env, async (url, options) => {
    assert.equal(String(url), 'http://localhost:3000/public/wayee/staff?serviceId=abc');
    assert.deepEqual(options.headers, { Accept: 'application/json' });
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    return Response.json([]);
  });
  assert.equal(r.status, 200);
  assert.match(r.headers.get('cache-control'), /no-store/);
});
test('proxy rejects arbitrary routes, methods, query injection and missing config', async () => {
  const never = () => { throw new Error('must not fetch'); };
  assert.equal((await proxyBooking(request('auth'), ['auth'], env, never)).status, 404);
  assert.equal((await proxyBooking(request('constructor'), ['constructor'], env, never)).status, 404);
  assert.equal((await proxyBooking(request('bookings'), ['bookings'], env, never)).status, 405);
  assert.equal((await proxyBooking(request('services?token=secret'), ['services'], env, never)).status, 400);
  assert.equal((await proxyBooking(request('staff?serviceId=a&serviceId=b'), ['staff'], env, never)).status, 400);
  assert.equal((await proxyBooking(request('studio'), ['studio'], {}, never)).status, 503);
  assert.equal((await proxyBooking(request('studio'), ['studio'], { ...env, STUDIO_TENANT_SLUG: '../admin' }, never)).status, 503);
});
test('mutation guard rejects cross-site, malformed origin, non-JSON and oversized body', async () => {
  for (const origin of ['https://evil.example', 'null', 'invalid']) {
    assert.equal((await proxyBooking(request('manage', post({ token: 'x' }, { origin })), ['manage'], env)).status, 403);
  }
  assert.equal((await proxyBooking(request('manage', { method: 'POST', body: '{}' }), ['manage'], env)).status, 415);
  assert.equal((await proxyBooking(request('manage', post({ token: 'x'.repeat(9000) })), ['manage'], env)).status, 413);
});
test('management token remains in JSON body; no upstream cookies or details leak', async () => {
  const r = await proxyBooking(request('manage', post({ token: 't'.repeat(43) })), ['manage'], env, async (url, options) => {
    assert.equal(new URL(url).search, '');
    assert.equal(JSON.parse(options.body).token, 't'.repeat(43));
    return Response.json({ code: 'CANCEL_CUTOFF_PASSED', message: 'private detail' }, { status: 409, headers: { 'set-cookie': 'secret' } });
  });
  assert.equal(r.status, 409);
  assert.deepEqual(await r.json(), { code: 'CANCEL_CUTOFF_PASSED' });
  assert.equal(r.headers.get('set-cookie'), null);
});
test('upstream network and invalid JSON fail safely', async () => {
  for (const fetcher of [async () => { throw new Error('secret host'); }, async () => new Response('<html>error</html>')]) {
    const r = await proxyBooking(request('studio'), ['studio'], env, fetcher);
    assert.equal(r.status, 502);
    assert.deepEqual(await r.json(), { code: 'UPSTREAM_UNAVAILABLE' });
  }
});
