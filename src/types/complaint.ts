// Aligned with backend ComplaintResponse schema
export type ComplaintStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED' | 'Open' | 'In Progress' | 'Resolved';
export type ComplaintCategory = string;

export interface Complaint {
  id: string;
  organization_id: string;
  election_id: string;
  title: string;
  name?: string | null;
  description?: string | null;
  desc?: string | null;
  ward?: string | null;
  date?: string | null;
  category: ComplaintCategory;
  status: ComplaintStatus;
  reported_by_name?: string | null;
  reported_by_phone?: string | null;
  submitted_by_name?: string | null;
  submitted_by_user_id?: string | null;
  ward_name?: string | null;
  assigned_to_user_id?: string | null;
  resolution_notes?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}
