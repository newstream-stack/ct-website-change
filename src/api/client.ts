const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const token = sessionStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    // Reload to force login — replace with router.push('/login') when routing is in place
    window.location.reload();
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `HTTP ${res.status}`);
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const apiGet  = <T>(path: string) => request<T>('GET', path);
export const apiPost = <T>(path: string, body?: unknown) => request<T>('POST', path, body);
export const apiPut  = <T>(path: string, body?: unknown) => request<T>('PUT', path, body);
export const apiDel  = <T>(path: string) => request<T>('DELETE', path);
