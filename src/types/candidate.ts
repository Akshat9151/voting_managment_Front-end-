// Aligned with backend CandidateResponse schema
export type CandidateStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
export type PostType = 'sarpanch' | 'panch';

export interface CandidateDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  verification_status: string;
  created_at: string;
}

export interface Candidate {
  id: string;
  election_id?: string;
  position_id?: string;
  constituency_id?: string | null;
  full_name?: string;           // backend field (was 'name')
  candidate_id_number?: string | null;
  party_name?: string | null;  // backend field (was 'post')
  party_symbol_url?: string | null;
  photo_url?: string | null;   // backend field (was 'photo')
  phone?: string | null;
  email?: string | null;
  manifesto?: string | null;
  status?: CandidateStatus;
  display_order?: number;
  rejection_reason?: string | null;
  approved_by?: string | null;
  documents?: CandidateDocument[];
  created_at?: string;
  updated_at?: string;

  // Legacy UI compatibility
  name?: string;
  hindiName?: string;
  post?: string;
  postType?: PostType;
  constituency?: string;
  symbol?: string;
  symbolName?: string;
  photo?: string;
  slogan?: string;
  votersCount?: number;
  volunteersCount?: number;
}

export interface CandidateCreate {
  election_id: string;
  position_id: string;
  constituency_id?: string;
  full_name: string;
  party_name?: string;
  party_symbol_url?: string;
  photo_url?: string;
  phone?: string;
  email?: string;
  manifesto?: string;
  display_order?: number;
}
