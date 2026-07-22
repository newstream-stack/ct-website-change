import { readJsonStorage, writeJsonStorage, writeStringStorage, removeStorageItem } from './storage';
import type { AuthUser } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const REFRESH_KEY = 'auth_refresh_token';

const isAuthUser = (value: unknown): value is AuthUser => {
  if (typeof value !== 'object' || value === null) return false;
  const user = value as Partial<AuthUser>;
  return typeof user.id === 'string' && typeof user.name === 'string' && typeof user.email === 'string';
};

function clearAuthStorage(storage: Storage): void {
  removeStorageItem(storage, TOKEN_KEY);
  removeStorageItem(storage, USER_KEY);
  removeStorageItem(storage, REFRESH_KEY);
}

// remember=true persists across browser restarts (localStorage); remember=false clears
// once the tab/browser closes (sessionStorage) — only one of the two ever holds a session.
export function saveAuthSession(token: string, user: AuthUser, remember: boolean): void {
  const target = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  writeStringStorage(target, TOKEN_KEY, token);
  writeJsonStorage(target, USER_KEY, user);
  clearAuthStorage(other);
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAuthUser(): AuthUser | null {
  return readJsonStorage(localStorage, USER_KEY, null, isAuthUser) ?? readJsonStorage(sessionStorage, USER_KEY, null, isAuthUser);
}

export function clearAllAuthStorage(): void {
  clearAuthStorage(localStorage);
  clearAuthStorage(sessionStorage);
}
