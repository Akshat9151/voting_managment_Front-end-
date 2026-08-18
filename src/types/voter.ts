export type VoterChannel = 'WhatsApp' | 'SMS Only';
export type VoterStatus = 'Valid' | 'Missing Mobile' | 'Duplicate';
export type VoterConsent = 'Verified' | 'Pending' | 'Missing Mobile';

export interface Voter {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  ward: string;
  mobile: string;
  channel: VoterChannel;
  consent: VoterConsent;
  source: string;
  status: VoterStatus;
  house?: string;

  // Backend Data Submission & Quality check fields
  voter_id_number?: string;
  quality_score?: number;
  is_flagged_duplicate?: boolean;
  duplicate_reason?: string | null;
  ward_no?: string;
  booth_no?: string;
  email?: string;
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
