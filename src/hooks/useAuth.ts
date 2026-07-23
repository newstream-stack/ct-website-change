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

  // Every useAuth() instance holds its own state, so logins from a component
  // that isn't this one (e.g. LoginPage) would otherwise leave long-lived
  // instances like useKnowledgeBaseAccess's stuck on stale pre-login state.
  useEffect(() => {
    const onAuthChanged = () => setUser(getStoredUser());
    window.addEventListener('auth:changed', onAuthChanged);
    return () => window.removeEventListener('auth:changed', onAuthChanged);
  }, []);

  return { user, isLoggedIn: user !== null, logout, refreshUser };
}
