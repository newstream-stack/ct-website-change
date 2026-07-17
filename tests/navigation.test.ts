import assert from 'node:assert/strict';
import test from 'node:test';
import { getSafeExternalUrl, toSafeExternalUrl } from '../src/utils/navigation.ts';

test('payment redirects allow http and https URLs', () => {
  assert.equal(toSafeExternalUrl('/checkout', 'https://example.com'), 'https://example.com/checkout');
  assert.equal(toSafeExternalUrl('http://localhost:3000/pay', 'https://example.com'), 'http://localhost:3000/pay');
});

test('payment redirects reject executable protocols', () => {
  assert.throws(() => toSafeExternalUrl('javascript:alert(1)', 'https://example.com'), /不安全/);
  assert.throws(() => toSafeExternalUrl('data:text/html,test', 'https://example.com'), /不安全/);
});

test('optional external links become inert when unsafe', () => {
  assert.equal(getSafeExternalUrl('javascript:alert(1)', 'https://example.com'), undefined);
  assert.equal(getSafeExternalUrl('https://safe.example/path', 'https://example.com'), 'https://safe.example/path');
});
