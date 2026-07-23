export function readJsonStorage<T>(
  storage: Storage,
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
  migrate?: (value: unknown) => unknown,
): T {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    let value: unknown = JSON.parse(raw);
    if (migrate) value = migrate(value);
    if (isValid(value)) return value;
    storage.removeItem(key);
  } catch {
    try { storage.removeItem(key); } catch { /* Storage may be unavailable. */ }
  }
  return fallback;
}

const isProductLike = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
  && typeof (value as Record<string, unknown>).id === 'number'
  && typeof (value as Record<string, unknown>).price === 'number';

/**
 * Backfills `stock` on any embedded Product-shaped object that predates the field
 * (e.g. impact_cart / impact_orders written to localStorage before this release),
 * so historical records still pass validation instead of being wiped wholesale.
 */
export function backfillLegacyProductStock<T>(value: T, fallbackStock = Number.MAX_SAFE_INTEGER): T {
  if (Array.isArray(value)) {
    return value.map((entry) => backfillLegacyProductStock(entry, fallbackStock)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const patched: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      patched[key] = backfillLegacyProductStock(val, fallbackStock);
    }
    if (isProductLike(patched) && typeof patched.stock !== 'number') {
      patched.stock = fallbackStock;
    }
    return patched as unknown as T;
  }
  return value;
}

export function writeJsonStorage(storage: Storage, key: string, value: unknown): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function writeStringStorage(storage: Storage, key: string, value: string): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(storage: Storage, key: string): void {
  try { storage.removeItem(key); } catch { /* Storage may be unavailable. */ }
}
