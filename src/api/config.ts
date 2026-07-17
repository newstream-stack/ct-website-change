const mockSetting = import.meta.env.VITE_USE_MOCK_API;
// Development defaults to mock data; production fails closed to REST unless mock mode is explicitly enabled.
export const USE_MOCK_API = mockSetting === 'true' || (mockSetting !== 'false' && import.meta.env.DEV);

function resolveApiBaseUrl(): string {
  const value = String(import.meta.env.VITE_API_BASE_URL ?? '').trim();
  if (USE_MOCK_API) return value;
  if (!value) throw new Error('正式 API 模式缺少 VITE_API_BASE_URL');
  const url = new URL(value, window.location.origin);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('VITE_API_BASE_URL 必須使用 http 或 https');
  if (import.meta.env.PROD && url.protocol !== 'https:') throw new Error('正式環境 API 必須使用 HTTPS');
  return url.toString().replace(/\/$/, '');
}

export const API_BASE_URL = resolveApiBaseUrl();
