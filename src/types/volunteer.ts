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
}

export interface Booth {
  boothNo: string;
  location: string;
  incharge: string;
  voters: number;
  slips: number;
  coverage: string;
}

export interface VolunteerVoter {
  id: string;
  name: string;
  age: number;
  mobile: string;
  house: string;
  status: VolunteerVoterStatus;
  slipHanded: boolean;
}

export interface VolunteerActivityStats {
  votersAdded: number;
  callsMade: number;
  visitsLogged: number;
  slipsHanded: number;
}
