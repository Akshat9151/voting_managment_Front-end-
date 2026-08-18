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
  loginWithOtp: (contact: string, role?: UserRole) => Promise<void>;
  loginDemo: (role?: UserRole) => Promise<void>;
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
    if (user.is_superuser || user.roles?.includes('SUPER_ADMIN')) return 'SUPER_ADMIN';
    if (user.roles?.includes('ADMIN')) return 'ADMIN';
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
      const rawUser = data.user || {};
      const authUser: AuthUser = {
        id: rawUser.id || 'user-id',
        email: rawUser.email || email.trim(),
        first_name: rawUser.first_name || 'Admin',
        last_name: rawUser.last_name || 'User',
        full_name: rawUser.name || `${rawUser.first_name || 'Admin'} ${rawUser.last_name || 'User'}`.trim(),
        organization_id: rawUser.organization_id || null,
        roles: rawUser.roles || (rawUser.role ? [rawUser.role.toUpperCase()] : ['ADMIN']),
        permissions: rawUser.permissions || [],
        is_superuser: Boolean(rawUser.is_superuser),
        mfa_enabled: Boolean(rawUser.mfa_enabled),
        phone: rawUser.phone || null
      };

      tokenStore.setSession(data.access_token, data.refresh_token, authUser, false);
      setUser(authUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Quick Demo Login ────────────────────────────────────────────────────────
  const loginDemo = async (role: UserRole = 'SUPER_ADMIN') => {
    setIsLoading(true);
    try {
      // First try authenticating with real backend Super Admin credentials
      try {
        const data = await authApi.login('superadmin@electwin.com', 'SuperSecureAdminPassword123!');
        const rawUser = data.user || {};
        const authUser: AuthUser = {
          id: rawUser.id || 'superadmin-id',
          email: rawUser.email || 'superadmin@electwin.com',
          first_name: rawUser.first_name || 'Super',
          last_name: rawUser.last_name || 'Admin',
          full_name: rawUser.name || `${rawUser.first_name || 'Super'} ${rawUser.last_name || 'Admin'}`.trim(),
          organization_id: rawUser.organization_id || null,
          roles: rawUser.roles || ['SUPER_ADMIN'],
          permissions: rawUser.permissions || ['all'],
          is_superuser: true,
          mfa_enabled: false,
          phone: rawUser.phone || '+91 98290 14285'
        };

        tokenStore.setSession(data.access_token, data.refresh_token, authUser, false);
        setUser(authUser);
        setIsAuthenticated(true);
        return;
      } catch {
        // Fall back to offline mock demo session if backend is not reachable
        const mockUser: AuthUser = {
          id: `demo-${Date.now()}`,
          email: 'superadmin@electwin.com',
          first_name: 'Demo',
          last_name: 'Administrator',
          full_name: 'Demo Administrator',
          organization_id: 'default-org',
          roles: [role],
          permissions: ['all'],
          is_superuser: role === 'SUPER_ADMIN',
          mfa_enabled: false,
          phone: '+91 98290 14285'
        };

        tokenStore.setSession('mock_demo_access_token', 'mock_demo_refresh_token', mockUser, true);
        setUser(mockUser);
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP Login ───────────────────────────────────────────────────────────────
  const loginWithOtp = async (contact: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const normalizedContact = contact.trim();
      const email = normalizedContact.includes('@')
        ? normalizedContact
        : `${normalizedContact.replace(/\s+/g, '').toLowerCase()}@electwin.local`;

      const mockUser: AuthUser = {
        id: `otp-user-${Date.now()}`,
        email,
        first_name: 'OTP',
        last_name: 'User',
        full_name: 'OTP User',
        organization_id: null,
        roles: [role ?? 'ADMIN'],
        permissions: ['all'],
        is_superuser: role === 'SUPER_ADMIN',
        mfa_enabled: true,
        phone: normalizedContact.includes('@') ? '' : normalizedContact
      };

      tokenStore.setSession('mock_otp_access_token', 'mock_otp_refresh_token', mockUser, true);
      setUser(mockUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    const rt = tokenStore.getRefresh();
    if (rt && !tokenStore.isMock()) {
      try { await httpClient.post('/auth/logout', { refresh_token: rt }); } catch { /* ignore */ }
    }
    tokenStore.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, permissions, currentRole, isLoading, login, loginWithOtp, loginDemo, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
