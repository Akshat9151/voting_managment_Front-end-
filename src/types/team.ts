// Aligned with backend UserResponse — replaces old "TeamMember" concept
export interface TeamMember {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  organization_id?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  is_superuser?: boolean;
  mfa_enabled?: boolean;
  last_login_at?: string | null;
  roles?: string[];
  permissions?: string[];
  created_at?: string;

  // Legacy UI compatibility
  name?: string;
  role?: string;
  roleTitle?: string;
  ward?: string;
  status?: string;
  votersHandled?: number;
  addedDate?: string;
}
