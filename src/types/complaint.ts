// Aligned with backend ComplaintResponse schema
export type ComplaintStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED' | 'Open' | 'In Progress' | 'Resolved';
export type ComplaintCategory = 'INFRASTRUCTURE' | 'CORRUPTION' | 'BOOTH_MALPRACTICE' | 'PERSONAL' | 'OTHER' | 'Water Supply' | 'Health / School' | 'Road Drainage' | 'Electricity';

export interface Complaint {
  id: string;
  organization_id: string;
  election_id: string;
  title: string;
  description?: string | null;
  category: ComplaintCategory;
  status: ComplaintStatus;
  reported_by_name?: string | null;
  reported_by_phone?: string | null;
  ward_name?: string | null;
  assigned_to_user_id?: string | null;
  resolution_notes?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}
