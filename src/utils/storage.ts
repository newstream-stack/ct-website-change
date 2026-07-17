export function readJsonStorage<T>(
  storage: Storage,
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
): T {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    if (isValid(value)) return value;
    storage.removeItem(key);
  } catch {
    try { storage.removeItem(key); } catch { /* Storage may be unavailable. */ }
  }
  return fallback;
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
