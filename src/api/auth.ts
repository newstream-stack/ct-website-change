// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ─── Dev stub (remove block when backend is ready) ────────────────────────────

const DEV_ACCOUNT = {
  email: 'test@ct.org.tw',
  password: 'impact2024',
  user: { id: 'dev-001', name: '測試帳號', email: 'test@ct.org.tw' },
};

async function devDelay() {
  await new Promise(r => setTimeout(r, 450));
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthResponse> {
  // TODO: replace with real API call ↓
  // const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  // return res.data;

  await devDelay();
  if (email === DEV_ACCOUNT.email && password === DEV_ACCOUNT.password) {
    return { token: 'dev-token-placeholder', user: DEV_ACCOUNT.user };
  }
  throw new Error('帳號或密碼錯誤');
}

export async function register(params: {
  name: string;
  email: string;
  password: string;
  address: string;
}): Promise<AuthResponse> {
  // TODO: replace with real API call ↓
  // const res = await apiClient.post<AuthResponse>('/auth/register', params);
  // return res.data;

  await devDelay();
  return {
    token: 'dev-token-placeholder',
    user: { id: 'dev-new', name: params.name, email: params.email },
  };
}

export async function socialLogin(provider: 'facebook' | 'google'): Promise<AuthResponse> {
  // TODO: replace with real OAuth2 flow ↓
  // window.location.href = `/auth/${provider}`;

  await devDelay();
  return {
    token: 'dev-token-placeholder',
    user: { id: 'dev-social', name: `${provider} 用戶`, email: `social@${provider}.dev` },
  };
}

export function logout(): void {
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_user');
  // TODO: call POST /auth/logout to invalidate server-side session
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(res: AuthResponse): void {
  sessionStorage.setItem('auth_token', res.token);
  sessionStorage.setItem('auth_user', JSON.stringify(res.user));
}
