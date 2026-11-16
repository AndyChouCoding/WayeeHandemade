import assert from 'node:assert/strict';
import test from 'node:test';
import { articles, demoNotice, products, services } from '../scripts/instagram-content-manifest.mjs';

test('Instagram demo manifest has unique, safe content mappings', () => {
  assert.equal(articles.length, 6);
  assert.equal(products.length, 4);
  assert.equal(services.length, 3);
  const content = [...articles, ...products];
  assert.equal(new Set(content.map((item) => item.slug)).size, content.length);
  assert.ok(content.every((item) => item.slug.startsWith('ig-demo-')));
  assert.ok(content.every((item) => item.images.length >= 1 && item.images.length <= 8));
  assert.deepEqual(products.find((item) => item.sourceId === 'DcvuvRzE-xd').images, [
    'DcvuvRzE-xd_01.jpg',
    'DcvuvRzE-xd_02.jpg',
    'DcvuvRzE-xd_03.jpg',
  ]);
});

test('simulated products and services contain complete business fields and warning', () => {
  for (const product of products) {
    assert.ok(product.priceAmount > 0);
    assert.ok(product.material);
    assert.ok(product.dimensions);
    assert.ok(product.productionTime);
  }
  for (const service of services) {
    assert.ok(service.priceAmount > 0);
    assert.ok(service.durationMin >= 5);
    assert.match(service.name, /（示範）$/);
    assert.match(service.description, new RegExp(demoNotice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
