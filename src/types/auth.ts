export type UserRole = 'superadmin' | 'admin' | 'volunteer';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  phone?: string;
  ward?: string;
  avatar?: string;
  organization_id?: string | null;
  permissions?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  currentRole: UserRole;
}
