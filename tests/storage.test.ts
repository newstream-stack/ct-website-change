import assert from 'node:assert/strict';
import test from 'node:test';
import { backfillLegacyProductStock, readJsonStorage, writeJsonStorage } from '../src/utils/storage.ts';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const isNumbers = (value: unknown): value is number[] => Array.isArray(value) && value.every((item) => typeof item === 'number');

test('storage returns validated JSON', () => {
  const storage = new MemoryStorage();
  assert.equal(writeJsonStorage(storage, 'items', [1, 2]), true);
  assert.deepEqual(readJsonStorage(storage, 'items', [], isNumbers), [1, 2]);
});

test('storage removes malformed JSON and returns fallback', () => {
  const storage = new MemoryStorage();
  storage.setItem('items', '{broken');
  assert.deepEqual(readJsonStorage(storage, 'items', [], isNumbers), []);
  assert.equal(storage.getItem('items'), null);
});

test('storage rejects structurally invalid data', () => {
  const storage = new MemoryStorage();
  storage.setItem('items', JSON.stringify(['wrong']));
  assert.deepEqual(readJsonStorage(storage, 'items', [], isNumbers), []);
});

const isCartItemsWithStock = (value: unknown): value is Array<{ product: { id: number; price: number; stock: number }; quantity: number }> =>
  Array.isArray(value) && value.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const candidate = item as { product?: unknown; quantity?: unknown };
    const product = candidate.product as Record<string, unknown> | undefined;
    return typeof candidate.quantity === 'number'
      && typeof product === 'object' && product !== null
      && typeof product.id === 'number' && typeof product.price === 'number'
      && Number.isInteger(product.stock) && (product.stock as number) >= 0;
  });

test('backfillLegacyProductStock fills missing stock on nested product objects', () => {
  const legacyCart = [{ product: { id: 1, price: 350 }, quantity: 2 }];
  const migrated = backfillLegacyProductStock(legacyCart) as typeof legacyCart & { product: { stock: number } }[];
  assert.equal((migrated[0].product as { stock: number }).stock, Number.MAX_SAFE_INTEGER);
});

test('readJsonStorage migrates legacy cart/order data missing stock instead of wiping it', () => {
  const storage = new MemoryStorage();
  const legacyCart = [{ product: { id: 1, name: '舊商品', price: 350 }, quantity: 2 }];
  storage.setItem('impact_cart', JSON.stringify(legacyCart));

  const migrated = readJsonStorage(storage, 'impact_cart', [], isCartItemsWithStock, backfillLegacyProductStock);
  assert.equal(migrated.length, 1);
  assert.equal(migrated[0].product.stock, Number.MAX_SAFE_INTEGER);
  assert.notEqual(storage.getItem('impact_cart'), null);
});
