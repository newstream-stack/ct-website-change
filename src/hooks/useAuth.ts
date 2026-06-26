import { useState, useEffect, useCallback } from 'react';
import { getStoredUser, logout as apiLogout } from '../api/auth';
import type { AuthUser } from '../api/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  isLoggedIn: boolean;
  logout: () => void;
  refreshUser: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const refreshUser = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  // Sync across tabs via storage events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { user, isLoggedIn: user !== null, logout, refreshUser };
}
