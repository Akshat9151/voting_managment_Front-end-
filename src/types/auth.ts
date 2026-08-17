export type UserRole = 'superadmin' | 'admin' | 'volunteer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  ward?: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentRole: UserRole;
}
