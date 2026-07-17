import { useState, useEffect, useCallback } from 'react';
import { getStoredUser, logout as apiLogout } from '../api/auth';
import type { AuthUser } from '../api/auth';
import { subscribeToLogout } from '../utils/authEvents';

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
    void apiLogout();
    setUser(null);
  }, []);

  // Session credentials stay isolated per tab; only logout is broadcast without sharing tokens.
  useEffect(() => {
    return subscribeToLogout(() => setUser(null));
  }, []);

  useEffect(() => {
    const onAuthExpired = () => setUser(null);
    window.addEventListener('auth:expired', onAuthExpired);
    return () => window.removeEventListener('auth:expired', onAuthExpired);
  }, []);

  return { user, isLoggedIn: user !== null, logout, refreshUser };
}
