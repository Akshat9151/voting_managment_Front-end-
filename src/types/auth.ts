// Aligns with backend UserRole and AuthUser
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'VOLUNTEER' | 'CUSTOM' | 'superadmin' | 'admin' | 'volunteer';

export interface User {
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

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentRole: UserRole;
  permissions: string[];
}
