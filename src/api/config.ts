const mockSetting = String(import.meta.env.VITE_USE_MOCK_API ?? '').trim().toLowerCase();
// The frontend prototype stays usable after deployment. REST mode is enabled only when explicitly requested.
export const USE_MOCK_API = mockSetting !== 'false';

function resolveApiBaseUrl(): string {
  const value = String(import.meta.env.VITE_API_BASE_URL ?? '').trim();
  if (USE_MOCK_API) return value;
  if (!value) return '';
  try {
    const url = new URL(value, window.location.origin);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    if (import.meta.env.PROD && url.protocol !== 'https:') return '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return '';
  }
}

export const API_BASE_URL = resolveApiBaseUrl();
