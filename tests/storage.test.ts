import assert from 'node:assert/strict';
import test from 'node:test';
import { readJsonStorage, writeJsonStorage } from '../src/utils/storage.ts';

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
