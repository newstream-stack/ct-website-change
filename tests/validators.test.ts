import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertApiData,
  isCreateOrderResponse,
  isEpaperIssue,
  isEpaperIssueSummaries,
  isNewsItem,
  isPaymentStatusResponse,
} from '../src/api/validators.ts';

const product = {
  id: 1,
  name: '商品',
  englishName: 'Product',
  price: 600,
  stock: 10,
  imageUrl: 'https://example.com/product.jpg',
  description: '說明',
  specs: ['規格'],
  details: '內容',
  gallery: ['https://example.com/product.jpg'],
};

test('news validator rejects malformed server data', () => {
  assert.equal(isNewsItem({ id: 1, title: '<script>alert(1)</script>' }), false);
  const news = {
    id: 1,
    title: '標題',
    excerpt: '摘要',
    category: '最新文章',
    author: '作者',
    date: '2026-07-17',
    imageUrl: 'https://example.com/image.jpg',
  };
  assert.equal(isNewsItem(news), true);
  assert.equal(isNewsItem({ ...news, tags: 'not-an-array' }), false);
});

test('order validator enforces nested data and status enums', () => {
  const order = {
    orderNumber: 'ORDER-1',
    date: '2026-07-17',
    name: '王小明',
    phone: '0912345678',
    email: 'test@example.com',
    address: '台北市',
    paymentMethod: 'credit-card',
    items: [{ product, quantity: 1 }],
    subtotal: 600,
    shippingFee: 0,
    total: 600,
    status: 'payment_pending',
  };

  assert.equal(isCreateOrderResponse({ order, paymentUrl: 'https://payment.example/session' }), true);
  assert.equal(isCreateOrderResponse({ order: { ...order, status: 'admin_override' } }), false);
  assert.equal(isCreateOrderResponse({ order: { ...order, items: [{ product, quantity: -1 }] } }), false);
  assert.equal(isCreateOrderResponse({ order: { ...order, items: [{ product, quantity: 1, variant: '信心' }] } }), true);
  assert.equal(isCreateOrderResponse({ order: { ...order, items: [{ product, quantity: 1, variant: 42 }] } }), false);
});

test('payment validator only accepts known resource states', () => {
  assert.equal(isPaymentStatusResponse({ type: 'order', reference: 'ORDER-1', status: 'paid' }), true);
  assert.equal(isPaymentStatusResponse({ type: 'order', reference: 'ORDER-1', status: 'success_from_url' }), false);
  assert.throws(
    () => assertApiData({ status: 'paid' }, isPaymentStatusResponse, '付款狀態'),
    /回應格式不正確/,
  );
});

test('epaper issue validator rejects empty page arrays and non-positive numbers', () => {
  const validIssue = {
    issueNumber: 4868,
    dateLabel: '第 4868 期',
    pages: [{ pageNumber: 1, imageUrl: 'https://example.com/page-1.jpg' }],
  };

  assert.equal(isEpaperIssue(validIssue), true);
  assert.equal(isEpaperIssue({ ...validIssue, pages: [] }), false, 'an issue with no pages must be rejected');
  assert.equal(isEpaperIssue({ ...validIssue, issueNumber: 0 }), false);
  assert.equal(isEpaperIssue({ ...validIssue, issueNumber: -1 }), false);
  assert.equal(
    isEpaperIssue({ ...validIssue, pages: [{ pageNumber: 0, imageUrl: 'https://example.com/page-1.jpg' }] }),
    false,
    'page numbers must be positive',
  );
  assert.equal(
    isEpaperIssue({ ...validIssue, pages: [{ pageNumber: -1, imageUrl: 'https://example.com/page-1.jpg' }] }),
    false,
  );
});

test('epaper issue summaries validator enforces positive issue numbers', () => {
  assert.equal(isEpaperIssueSummaries([{ issueNumber: 4868, dateLabel: '第 4868 期' }]), true);
  assert.equal(isEpaperIssueSummaries([{ issueNumber: 0, dateLabel: '第 0 期' }]), false);
  assert.equal(isEpaperIssueSummaries([{ issueNumber: 4868 }]), false);
});
