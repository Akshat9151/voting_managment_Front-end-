export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';
export type ComplaintCategory = 'Water Supply' | 'Health / School' | 'Road Drainage' | 'Electricity' | 'Sanitation' | 'Other';

export interface Complaint {
  id: string;
  name: string;
  ward: string;
  category: ComplaintCategory;
  desc: string;
  date: string;
  status: ComplaintStatus;
}
