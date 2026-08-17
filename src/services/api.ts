import {
  Voter,
  Candidate,
  TeamMember,
  DeliveryLog,
  Complaint,
  ComplaintStatus,
  Expense,
  Volunteer,
  Booth,
  VolunteerVoter,
  VolunteerVoterStatus,
  BroadcastPayload,
  AudienceSplit,
  BudgetSummary,
  AnalyticsData,
  User,
  UserRole
} from '../types';
import {
  INITIAL_CANDIDATES,
  INITIAL_TEAM,
  INITIAL_VOTERS,
  INITIAL_DELIVERY_LOGS,
  INITIAL_COMPLAINTS,
  INITIAL_EXPENSES,
  INITIAL_VOLUNTEERS,
  INITIAL_BOOTHS,
  INITIAL_VOLUNTEER_VOTERS
} from './mockData';

const BUDGET_LIMIT = 150000;

const getStored = <T>(key: string, defaultVal: T): T => {
  try {
    const data = localStorage.getItem(`electwin_${key}`);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`electwin_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
};

class ApiService {
  async login(phone: string, role: UserRole): Promise<{ user: User; token: string }> {
    const roleNames: Record<UserRole, string> = {
      superadmin: 'Rameshwar Patel (Owner)',
      admin: 'Rajesh Kumar (Campaign Admin)',
      volunteer: 'Kailash Saini (Ward 02 Volunteer)'
    };
    const user: User = {
      id: `usr_${Date.now()}`,
      name: roleNames[role] || 'Campaign User',
      role,
      phone: phone || '+91 98290 14285',
      ward: role === 'volunteer' ? 'Ward 02 – Patel Basti' : 'All Wards'
    };
    return { user, token: 'mock-jwt-token-electwin' };
  }

  async getCandidates(): Promise<Candidate[]> {
    return getStored<Candidate[]>('candidates', INITIAL_CANDIDATES);
  }

  async addCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
    const candidates = await this.getCandidates();
    const newCandidate: Candidate = {
      ...candidate,
      id: `cand_${Date.now()}`
    };
    const updated = [newCandidate, ...candidates];
    setStored('candidates', updated);
    return newCandidate;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return getStored<TeamMember[]>('team', INITIAL_TEAM);
  }

  async addTeamMember(member: Omit<TeamMember, 'id' | 'addedDate' | 'votersHandled'>): Promise<TeamMember> {
    const team = await this.getTeamMembers();
    const newMember: TeamMember = {
      ...member,
      id: `team_${Date.now()}`,
      votersHandled: 0,
      addedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const updated = [newMember, ...team];
    setStored('team', updated);
    return newMember;
  }

  async getVoters(): Promise<Voter[]> {
    return getStored<Voter[]>('voters', INITIAL_VOTERS);
  }

  async addVoter(voter: Omit<Voter, 'id'>): Promise<Voter> {
    const voters = await this.getVoters();
    const newVoter: Voter = {
      ...voter,
      id: `V-${Date.now().toString().slice(-4)}`
    };
    const updated = [newVoter, ...voters];
    setStored('voters', updated);
    return newVoter;
  }

  async addVotersBatch(newVoters: Omit<Voter, 'id'>[]): Promise<Voter[]> {
    const voters = await this.getVoters();
    const created: Voter[] = newVoters.map((v, i) => ({
      ...v,
      id: `V-${(Date.now() + i).toString().slice(-4)}`
    }));
    const updated = [...created, ...voters];
    setStored('voters', updated);
    return created;
  }

  async getAudienceSplit(): Promise<AudienceSplit> {
    const voters = await this.getVoters();
    const whatsapp = voters.filter(v => v.channel === 'WhatsApp' && v.mobile).length;
    const sms = voters.filter(v => v.channel === 'SMS Only' || !v.mobile).length;
    const total = voters.length || 1;
    return {
      total: voters.length,
      whatsapp,
      sms,
      whatsappPercent: Math.round((whatsapp / total) * 100),
      smsPercent: Math.round((sms / total) * 100)
    };
  }

  async getDeliveryLogs(): Promise<DeliveryLog[]> {
    return getStored<DeliveryLog[]>('delivery_logs', INITIAL_DELIVERY_LOGS);
  }

  async sendBroadcast(_payload: BroadcastPayload): Promise<{ success: boolean; count: number }> {
    const voters = await this.getVoters();
    const newLogs: DeliveryLog[] = voters.slice(0, 8).map((v, idx) => ({
      id: `log_${Date.now()}_${idx}`,
      name: v.name,
      ward: v.ward,
      mobile: v.mobile || '+91 98000 00000',
      route: v.channel === 'WhatsApp' ? 'WhatsApp' : 'SMS Fallback',
      status: 'Delivered',
      read: v.channel === 'WhatsApp' ? 'Delivered ✓✓' : 'N/A (SMS)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    const existing = await this.getDeliveryLogs();
    setStored('delivery_logs', [...newLogs, ...existing]);
    return { success: true, count: voters.length };
  }

  async getComplaints(): Promise<Complaint[]> {
    return getStored<Complaint[]>('complaints', INITIAL_COMPLAINTS);
  }

  async addComplaint(complaint: Omit<Complaint, 'id' | 'date'>): Promise<Complaint> {
    const list = await this.getComplaints();
    const newComplaint: Complaint = {
      ...complaint,
      id: `GR-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const updated = [newComplaint, ...list];
    setStored('complaints', updated);
    return newComplaint;
  }

  async updateComplaintStatus(id: string, status: ComplaintStatus): Promise<Complaint | null> {
    const list = await this.getComplaints();
    const item = list.find(c => c.id === id);
    if (item) {
      item.status = status;
      setStored('complaints', list);
      return item;
    }
    return null;
  }

  async getExpenses(): Promise<Expense[]> {
    return getStored<Expense[]>('expenses', INITIAL_EXPENSES);
  }

  async addExpense(expense: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
    const list = await this.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: `exp_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const updated = [newExpense, ...list];
    setStored('expenses', updated);
    return newExpense;
  }

  async getBudgetSummary(): Promise<BudgetSummary> {
    const expenses = await this.getExpenses();
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = BUDGET_LIMIT - totalSpent;
    const utilizedPercent = Math.round((totalSpent / BUDGET_LIMIT) * 100);
    return {
      budgetLimit: BUDGET_LIMIT,
      totalSpent,
      remaining,
      utilizedPercent
    };
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return getStored<Volunteer[]>('volunteers', INITIAL_VOLUNTEERS);
  }

  async getBooths(): Promise<Booth[]> {
    return getStored<Booth[]>('booths', INITIAL_BOOTHS);
  }

  async getVolunteerVoters(): Promise<VolunteerVoter[]> {
    return getStored<VolunteerVoter[]>('volunteer_voters', INITIAL_VOLUNTEER_VOTERS);
  }

  async updateVolunteerVoterStatus(
    id: string,
    status: VolunteerVoterStatus,
    slipHanded?: boolean
  ): Promise<VolunteerVoter | null> {
    const list = await this.getVolunteerVoters();
    const voter = list.find(v => v.id === id);
    if (voter) {
      voter.status = status;
      if (slipHanded !== undefined) voter.slipHanded = slipHanded;
      setStored('volunteer_voters', list);
      return voter;
    }
    return null;
  }

  async addVolunteerVoter(voter: Omit<VolunteerVoter, 'id'>): Promise<VolunteerVoter> {
    const list = await this.getVolunteerVoters();
    const newVoter: VolunteerVoter = {
      ...voter,
      id: `V-02-${Math.floor(100 + Math.random() * 900)}`
    };
    const updated = [newVoter, ...list];
    setStored('volunteer_voters', updated);
    return newVoter;
  }

  async getAnalytics(): Promise<AnalyticsData> {
    return {
      wardCoverage: [
        { ward: 'Ward 01', percentage: 78 },
        { ward: 'Ward 02', percentage: 86 },
        { ward: 'Ward 03', percentage: 64 },
        { ward: 'Ward 04', percentage: 94 },
        { ward: 'Ward 05', percentage: 72 },
        { ward: 'Ward 06', percentage: 81 }
      ],
      channelDelivery: [
        { channel: 'WhatsApp', count: 2850, color: '#059669' },
        { channel: 'SMS Fallback', count: 612, color: '#0284c7' },
        { channel: 'Failed', count: 38, color: '#e11d48' }
      ],
      materialPrints: [
        { type: 'A5 Handbill Pamphlets', count: 5200 },
        { type: 'Flex Road Banners (3x6ft)', count: 48 },
        { type: 'Panna Pocket Slips', count: 3500 },
        { type: 'Digital WhatsApp Cards', count: 1840 }
      ],
      volunteerProductivity: [
        { name: 'Kailash Saini', slips: 540, calls: 320 },
        { name: 'Priya Sharma', slips: 680, calls: 480 },
        { name: 'Mukesh Gurjar', slips: 420, calls: 290 },
        { name: 'Mahesh Sharma', slips: 390, calls: 210 }
      ]
    };
  }
}

export const api = new ApiService();
