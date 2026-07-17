import { removeStorageItem } from '../utils/storage';
import { API_BASE_URL } from './config';

const DEFAULT_TIMEOUT_MS = 15_000;

export interface ApiRequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  options: ApiRequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  else options.signal?.addEventListener('abort', abortFromCaller, { once: true });

  try {
    let token: string | null = null;
    try { token = sessionStorage.getItem('auth_token'); } catch { /* Storage may be unavailable. */ }
    const headers: Record<string, string> = { Accept: 'application/json', ...options.headers };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: options.cache ?? (token ? 'no-store' : 'default'),
    });

    if (response.status === 401) {
      removeStorageItem(sessionStorage, 'auth_token');
      removeStorageItem(sessionStorage, 'auth_user');
      removeStorageItem(sessionStorage, 'auth_refresh_token');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    const contentType = response.headers.get('content-type') ?? '';
    const responseBody = response.status === 204
      ? undefined
      : contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      const rawMessage = typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
        && typeof (responseBody as { message: unknown }).message === 'string'
        ? (responseBody as { message: string }).message.trim().slice(0, 300)
        : '';
      const responseMessage = rawMessage || `請求失敗 (HTTP ${response.status})`;
      const message = response.status >= 500 ? '伺服器暫時無法處理請求，請稍後再試' : responseMessage;
      throw new ApiError(message, response.status);
    }

    return responseBody as T;
  } finally {
    window.clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
}

export const apiGet = <T>(path: string, options?: ApiRequestOptions) => request<T>('GET', path, undefined, options);
export const apiPost = <T>(path: string, body?: unknown, options?: ApiRequestOptions) => request<T>('POST', path, body, options);
export const apiPut = <T>(path: string, body?: unknown, options?: ApiRequestOptions) => request<T>('PUT', path, body, options);
export const apiDel = <T>(path: string, options?: ApiRequestOptions) => request<T>('DELETE', path, undefined, options);
