export type VolunteerVoterStatus = 'Visited' | 'Called' | 'Pending' | 'Not Reachable';

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  ward: string;
  phone: string;
  votersAdded: number;
  callsMade: number;
  slipsDistributed: number;
  status: 'Active' | 'On-Duty' | 'Inactive';
  
  // Backend schema extensions
  volunteer_code?: string;
  email?: string;
  daily_target?: number;
  daily_collection?: number;
  monthly_target?: number;
  monthly_collection?: number;
  approved_count?: number;
  rejected_count?: number;
  duplicate_count?: number;
}

export interface Booth {
  boothNo: string;
  location: string;
  incharge: string;
  voters: number;
  slips: number;
  coverage: string;
  target?: number;
  collected?: number;
}

export interface VolunteerVoter {
  id: string;
  name: string;
  age: number;
  mobile: string;
  house: string;
  status: VolunteerVoterStatus;
  slipHanded: boolean;
  
  // Backend data collection fields
  voter_id_number?: string;
  quality_score?: number;
  ward_no?: string;
  booth_no?: string;
}

export interface VolunteerActivityStats {
  votersAdded: number;
  callsMade: number;
  visitsLogged: number;
  slipsHanded: number;
}
