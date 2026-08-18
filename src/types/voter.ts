// Aligned with backend VoterResponse schema
export type VoterStatus =
  | 'REGISTERED' | 'VERIFIED' | 'ELIGIBLE' | 'INELIGIBLE' | 'CHECKED_IN' | 'VOTED' | 'BLOCKED' | 'SUSPENDED'
  | 'Valid' | 'Missing Mobile' | 'Pending';
export type VotingStatus = 'NOT_VOTED' | 'CHECKED_IN' | 'VOTED';

// Legacy UI types kept for display compatibility
export type VoterChannel = 'WhatsApp' | 'SMS Only';
export type VoterConsent = 'Verified' | 'Pending' | 'Missing Mobile';

export interface Voter {
  id: string;
  organization_id?: string;
  election_id?: string;
  constituency_id?: string | null;
  polling_station_id?: string | null;

  voter_id_number?: string;   // official EPIC/voter ID
  first_name?: string;
  last_name?: string;
  father_or_spouse_name?: string | null;
  date_of_birth?: string | null;
  age?: number | null;
  gender?: string | null;
  phone_number?: string | null;
  email?: string | null;
  address?: string | null;
  house_number?: string | null;
  ward_name?: string | null;
  notes?: string | null;

  status?: VoterStatus | string;
  voting_status?: VotingStatus;
  has_voted?: boolean;
  voted_at?: string | null;
  is_opt_out_notifications?: boolean;
  created_at?: string;
  updated_at?: string;

  // Legacy UI compatibility
  name?: string;
  ward?: string;
  mobile?: string;
  channel?: VoterChannel | string;
  consent?: VoterConsent | string;
  source?: string;
}

export interface AudienceSplit {
  total: number;
  whatsapp: number;
  sms: number;
  whatsappPercent: number;
  smsPercent: number;
}

export interface OcrStagedRow {
  id: string;
  epicNo: string;
  name: string;
  relativeName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  houseNo: string;
  mobile: string;
  confidence: number;
}

export interface ImportPreview {
  job_id: string;
  election_id: string;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  duplicate_rows: number;
  preview_data: any[];
  errors: any[];
}
