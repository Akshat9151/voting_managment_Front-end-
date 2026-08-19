import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';
import { httpClient, tokenStore } from '../services/httpClient';
import type { UserRole } from '../types';

export type { UserRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  organization_id: string | null;
  roles: string[];
  permissions: string[];
  is_superuser: boolean;
  mfa_enabled: boolean;
  phone?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  permissions: string[];
  currentRole: UserRole;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSession: (data: any, fallbackEmail?: string) => void;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly from stored session to avoid race condition on mount
  const initialUser = tokenStore.getUser() as AuthUser | null;
  const initialToken = tokenStore.getAccess();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(initialUser && initialToken));
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // ── Derive role from backend user data ──────────────────────────────────────
  const currentRole: UserRole = (() => {
    if (!user) return 'VOLUNTEER';
    const normalizedRoles = (user.roles ?? []).map((role) => role.toUpperCase().replace('-', '_').replace(' ', '_'));
    if (user.is_superuser || normalizedRoles.includes('SUPER_ADMIN')) return 'SUPER_ADMIN';
    if (normalizedRoles.includes('ADMIN')) return 'ADMIN';
    return 'VOLUNTEER';
  })();

  const permissions = user?.permissions ?? [];

  const hasPermission = (perm: string) =>
    user?.is_superuser || permissions.includes(perm);

  // ── Listen for 401 unauthorized events ──────────────────────────────────────
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // ── Real Email & Password Login ─────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email.trim(), password);
      loginWithSession(data, email);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSession = (data: any, fallbackEmail = '') => {
      const rawUser = data.user || {};
      const authUser: AuthUser = {
        id: rawUser.id || 'user-id',
        email: rawUser.email || fallbackEmail.trim(),
        first_name: rawUser.first_name || 'Admin',
        last_name: rawUser.last_name || 'User',
        full_name: rawUser.name || `${rawUser.first_name || 'Admin'} ${rawUser.last_name || 'User'}`.trim(),
        organization_id: rawUser.organization_id || null,
        roles: (rawUser.roles ?? (rawUser.role ? [rawUser.role] : ['VOLUNTEER'])).map((role: string) => role.toUpperCase().replace('-', '_').replace(' ', '_')),
        permissions: rawUser.permissions || [],
        is_superuser: Boolean(rawUser.is_superuser),
        mfa_enabled: Boolean(rawUser.mfa_enabled),
        phone: rawUser.phone || null
      };

    tokenStore.setSession(data.access_token, data.refresh_token, authUser);
    setUser(authUser);
    setIsAuthenticated(true);
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    const rt = tokenStore.getRefresh();
    if (rt) {
      try { await httpClient.post('/auth/logout', { refresh_token: rt }); } catch { /* ignore */ }
    }
    tokenStore.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, permissions, currentRole, isLoading, login, loginWithSession, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
