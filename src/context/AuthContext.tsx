import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  loginWithOtp: (contact: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true on mount while checking stored session
  const initDone = useRef(false);

  // ── Derive role from backend user data (no manual switching) ─────────────────
  const currentRole: UserRole = (() => {
    if (!user) return 'VOLUNTEER';
    if (user.is_superuser || user.roles.includes('SUPER_ADMIN')) return 'SUPER_ADMIN';
    if (user.roles.includes('ADMIN')) return 'ADMIN';
    return 'VOLUNTEER';
  })();

  const permissions = user?.permissions ?? [];

  const hasPermission = (perm: string) =>
    user?.is_superuser || permissions.includes(perm);

  // ── Restore session on mount (silent refresh) ─────────────────────────────
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const rt = tokenStore.getRefresh();
    if (!rt) {
      setIsLoading(false);
      return;
    }

    httpClient.post('/auth/refresh', { refresh_token: rt })
      .then((res) => {
        const payload = res.data.data ?? res.data;
        tokenStore.setAccess(payload.access_token);
        tokenStore.setRefresh(payload.refresh_token);
        const u = payload.user as AuthUser;
        setUser({ ...u, full_name: `${u.first_name} ${u.last_name}` });
        setIsAuthenticated(true);
      })
      .catch(() => {
        tokenStore.clear();
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── OTP Login ─────────────────────────────────────────────────────────────
  const loginWithOtp = async (contact: string, role?: UserRole) => {
    const normalizedContact = contact.trim();
    const email = normalizedContact.includes('@') ? normalizedContact : `${normalizedContact.replace(/\s+/g, '').toLowerCase()}@electwin.local`;
    const mockUser: AuthUser = {
      id: `otp-user-${Date.now()}`,
      email,
      first_name: 'OTP',
      last_name: 'User',
      full_name: 'OTP User',
      organization_id: null,
      roles: [role ?? 'SUPER_ADMIN'],
      permissions: ['all'],
      is_superuser: role === 'SUPER_ADMIN',
      mfa_enabled: true,
      phone: normalizedContact.includes('@') ? '' : normalizedContact
    };

    tokenStore.setAccess('mock_otp_access_token');
    tokenStore.setRefresh('mock_otp_refresh_token');
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  // ── Logout ────────────────────────────────────────────────────────────────
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
    <AuthContext.Provider value={{ isAuthenticated, user, permissions, currentRole, isLoading, loginWithOtp, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
