import type { AuthResponse, AuthUser, ChangePasswordRequest, ForgotPasswordRequest, ForgotPasswordResponse, LoginRequest, RegisterRequest, SocialLoginResponse, SocialProvider } from '../types/auth';
import { apiPost, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { saveAuthSession, getAuthUser, clearAllAuthStorage } from '../utils/authStorage';
import { assertApiData, isAuthResponse, isRecord } from './validators';
import { broadcastLogout } from '../utils/authEvents';

export type { AuthResponse, AuthUser, LoginRequest, RegisterRequest, SocialProvider } from '../types/auth';

const DEV_ACCOUNT = {
  email: 'test@ct.org.tw',
  password: 'impact2024',
  user: { id: 'dev-001', name: '測試帳號', email: 'test@ct.org.tw' },
};

async function devDelay() {
  await new Promise((resolve) => setTimeout(resolve, 450));
}

export async function login(params: LoginRequest, options?: ApiRequestOptions): Promise<AuthResponse> {
  if (!USE_MOCK_API) return assertApiData(await apiPost<unknown>('/api/auth/login', params, options), isAuthResponse, '登入');
  await devDelay();
  if (params.email === DEV_ACCOUNT.email && params.password === DEV_ACCOUNT.password) {
    return { token: 'dev-token-placeholder', user: DEV_ACCOUNT.user };
  }
  throw new Error('帳號或密碼錯誤');
}

export async function register(params: RegisterRequest, options?: ApiRequestOptions): Promise<AuthResponse> {
  if (!USE_MOCK_API) return assertApiData(await apiPost<unknown>('/api/auth/register', params, options), isAuthResponse, '註冊');
  await devDelay();
  return {
    token: 'dev-token-placeholder',
    user: { id: 'dev-new', name: params.name, email: params.email },
  };
}

export async function socialLogin(provider: SocialProvider, options?: ApiRequestOptions): Promise<SocialLoginResponse> {
  if (!USE_MOCK_API) return assertApiData(
    await apiPost<unknown>('/api/auth/social-login', { provider }, options),
    (value): value is SocialLoginResponse => isAuthResponse(value) || (isRecord(value) && typeof value.authorizationUrl === 'string'),
    '社群登入',
  );
  await devDelay();
  return {
    token: 'dev-token-placeholder',
    user: { id: 'dev-social', name: `${provider} 用戶`, email: `social@${provider}.dev` },
  };
}

export async function forgotPassword(params: ForgotPasswordRequest, options?: ApiRequestOptions): Promise<ForgotPasswordResponse> {
  if (!USE_MOCK_API) return assertApiData(
    await apiPost<unknown>('/api/auth/forgot-password', params, options),
    (value): value is ForgotPasswordResponse => isRecord(value) && value.accepted === true,
    '忘記密碼',
  );
  await devDelay();
  return { accepted: true };
}

export async function changePassword(params: ChangePasswordRequest, options?: ApiRequestOptions): Promise<void> {
  if (!USE_MOCK_API) return apiPost<void>('/api/me/password', params, options);
  await devDelay();
  if (params.newPassword.length < 8) throw new Error('新密碼至少需要 8 個字元');
}

export async function logout(options?: ApiRequestOptions): Promise<void> {
  const request = USE_MOCK_API
    ? Promise.resolve()
    : apiPost<void>('/api/auth/logout', undefined, options).catch(() => undefined);
  clearAllAuthStorage();
  window.dispatchEvent(new CustomEvent('auth:expired'));
  broadcastLogout();
  await request;
}

export function getStoredUser(): AuthUser | null {
  return getAuthUser();
}

// remember=true keeps the session across browser restarts; remember=false (default)
// clears it once the tab/browser closes.
export function saveSession(response: AuthResponse, remember = false): void {
  saveAuthSession(response.token, response.user, remember);
  window.dispatchEvent(new CustomEvent('auth:changed'));
}
