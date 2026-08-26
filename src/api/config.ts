const mockSetting = String(import.meta.env.VITE_USE_MOCK_API ?? '').trim().toLowerCase();

// 開發時預設 mock（本機不必準備後端）；正式 build 必須明確寫 VITE_USE_MOCK_API=true 才會進 mock。
// 這樣「部署時忘了設環境變數」不會安靜地退回假登入與假交易，而是走 REST 並在缺少
// VITE_API_BASE_URL 時直接報錯。原型展示站的 .env.production 有明確打開 mock。
export const USE_MOCK_API = import.meta.env.DEV ? mockSetting !== 'false' : mockSetting === 'true';

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
