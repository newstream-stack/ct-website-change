import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRouteUrl, readRoute } from '../src/routing.ts';

test('readRoute validates numeric route parameters', () => {
  const route = readRoute('?category=%E5%A5%89%E7%8D%BB&article=-1&plan=2&product=abc');
  assert.equal(route.category, '奉獻');
  assert.equal(route.articleId, null);
  assert.equal(route.planId, 2);
  assert.equal(route.productId, null);
});

test('buildRouteUrl omits empty home parameters', () => {
  assert.equal(buildRouteUrl('/', {
    category: '首頁', articleId: null, tag: null, author: null, planId: null, productId: null,
  }), '/');
});

test('route build and read preserve supported fields', () => {
  const url = buildRouteUrl('/news', {
    category: '最新文章', articleId: 12, tag: 'Faith', author: null, planId: null, productId: null,
  });
  const route = readRoute(new URL(url, 'https://example.com').search);
  assert.equal(route.articleId, 12);
  assert.equal(route.tag, 'Faith');
});

test('payment routes ignore conflicting content parameters', () => {
  const route = readRoute('?payment=order&reference=ORDER-123&article=99&category=%E5%A5%89%E7%8D%BB');
  assert.equal(route.category, '付款結果');
  assert.equal(route.paymentType, 'order');
  assert.equal(route.paymentReference, 'ORDER-123');
  assert.equal(route.articleId, null);
  assert.equal(route.planId, null);
});

test('payment route builder emits only verification parameters', () => {
  const url = buildRouteUrl('/', {
    category: '付款結果', articleId: 99, tag: 'ignored', author: null, planId: null, productId: null,
    paymentType: 'donation', paymentReference: 'DONATION-123',
  });
  assert.equal(url, '/?payment=donation&reference=DONATION-123');
});

test('payment references are bounded before use', () => {
  const route = readRoute(`?payment=event&reference=${'a'.repeat(500)}`);
  assert.equal(route.paymentReference?.length, 200);
});

test('subCategory round-trips through the URL so header submenu links land pre-filtered', () => {
  const url = buildRouteUrl('/', {
    category: '基督教論壇報', articleId: null, tag: null, author: null, planId: null, productId: null,
    subCategory: '人物報導',
  });
  assert.equal(url, '/?category=%E5%9F%BA%E7%9D%A3%E6%95%99%E8%AB%96%E5%A3%87%E5%A0%B1&sub=%E4%BA%BA%E7%89%A9%E5%A0%B1%E5%B0%8E');
  const route = readRoute(new URL(url, 'https://example.com').search);
  assert.equal(route.subCategory, '人物報導');
});

test('payment routes ignore a conflicting subCategory parameter', () => {
  const route = readRoute('?payment=order&reference=ORDER-123&sub=%E4%BA%BA%E7%89%A9%E5%A0%B1%E5%B0%8E');
  assert.equal(route.subCategory, null);
});
