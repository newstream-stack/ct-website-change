import assert from 'node:assert/strict';
import test from 'node:test';
import { formatCheckoutAmountLabel } from '../src/utils/donationAmount.ts';

test('one-time label shows the exact submitted amount', () => {
  assert.equal(formatCheckoutAmountLabel(1000, 'one-time', 6), '(NT$ 1000)');
});

test('installment label states the total explicitly when it does not divide evenly', () => {
  // 1000 / 6 = 166.67 -> per-period display rounds up to 167, but the
  // amount actually submitted/charged in total must still read as 1000.
  const label = formatCheckoutAmountLabel(1000, 'installment', 6);
  assert.match(label, /167 \/ 期/);
  assert.match(label, /總額 NT\$ 1000/);
});

test('installment label matches exactly when amount divides evenly', () => {
  const label = formatCheckoutAmountLabel(6000, 'installment', 6);
  assert.match(label, /1000 \/ 期/);
  assert.match(label, /總額 NT\$ 6000/);
});
