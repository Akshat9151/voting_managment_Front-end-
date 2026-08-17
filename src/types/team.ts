export interface TeamMember {
  id: string;
  name: string;
  role: 'Super Admin' | 'Admin' | 'Volunteer';
  roleTitle: string;
  ward: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Invited';
  votersHandled: number;
  addedDate: string;
}
