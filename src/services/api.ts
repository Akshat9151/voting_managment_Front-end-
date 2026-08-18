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
  UserRole,
  Task,
  TaskStatus,
  FieldActivity,
  AttendanceRecord,
  SubscriptionPlan,
  CurrentSubscription,
  Invoice,
  PlanTier
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
  INITIAL_VOLUNTEER_VOTERS,
  INITIAL_TASKS,
  INITIAL_FIELD_ACTIVITIES,
  INITIAL_ATTENDANCE,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_CURRENT_SUBSCRIPTION,
  INITIAL_INVOICES
} from './mockData';

const BUDGET_LIMIT = 150000;
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('electwin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

class ApiService {
  /**
   * Generic HTTP fetch wrapper for backend API calls
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        console.warn(`API request to ${endpoint} failed with status ${response.status}`);
        return null;
      }

      const json = await response.json();
      return (json.data !== undefined ? json.data : json) as T;
    } catch (err) {
      console.warn(`Network error requesting ${endpoint}:`, err);
      return null;
    }
  }

  async login(
    emailOrPhone: string,
    role: UserRole = 'superadmin',
    password?: string
  ): Promise<{ user: User; token: string }> {
    // 1. Attempt Real Backend JWT Login
    const loginEmail = emailOrPhone.includes('@')
      ? emailOrPhone.trim()
      : 'superadmin@electwin.com';
    const loginPassword = password || 'SuperSecureAdminPassword123!';

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        const token = data.access_token || 'mock-jwt-token-electwin';
        const backendUser = data.user || {};
        
        const mappedUser: User = {
          id: backendUser.id || `usr_${Date.now()}`,
          name: `${backendUser.first_name || ''} ${backendUser.last_name || ''}`.trim() || 'Super Administrator',
          email: backendUser.email || loginEmail,
          role: role,
          phone: backendUser.phone || emailOrPhone,
          ward: 'All Wards',
          organization_id: backendUser.organization_id || null,
        };

        localStorage.setItem('electwin_token', token);
        return { user: mappedUser, token };
      }
    } catch (e) {
      console.info('Backend login unreachable, proceeding with offline state.', e);
    }

    // 2. Fallback Demo / Offline Authentication
    const roleNames: Record<UserRole, string> = {
      superadmin: 'Rameshwar Patel (Owner)',
      admin: 'Rajesh Kumar (Campaign Admin)',
      volunteer: 'Kailash Saini (Ward 02 Volunteer)',
    };
    const user: User = {
      id: `usr_${Date.now()}`,
      name: roleNames[role] || 'Campaign User',
      role,
      phone: emailOrPhone || '+91 98290 14285',
      ward: role === 'volunteer' ? 'Ward 02 – Patel Basti' : 'All Wards',
    };
    const token = 'mock-jwt-token-electwin';
    localStorage.setItem('electwin_token', token);
    return { user, token };
  }

  async getCandidates(): Promise<Candidate[]> {
    const backendData = await this.request<any[]>('/candidates');
    if (backendData && Array.isArray(backendData) && backendData.length > 0) {
      return backendData.map((c, idx) => ({
        id: c.id || `cand_${idx}`,
        name: c.name || c.full_name || 'Candidate',
        hindiName: c.hindi_name || c.name,
        post: c.position || 'Sarpanch',
        postType: (c.post_type || 'sarpanch') as any,
        constituency: c.constituency_name || 'Gram Panchayat',
        symbol: c.symbol_url || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80',
        symbolName: c.symbol_name || 'Kisan Hal',
        photo: c.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        slogan: c.slogan || 'Seva, Vikas aur Samman',
        votersCount: c.voters_count || 1240,
        volunteersCount: c.volunteers_count || 18,
        manifesto: c.manifesto || 'Gram Vikas Sankalp 2026',
      }));
    }
    return getStored<Candidate[]>('candidates', INITIAL_CANDIDATES);
  }

  async addCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
    const candidates = await this.getCandidates();
    const newCandidate: Candidate = {
      ...candidate,
      id: `cand_${Date.now()}`,
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
      addedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    const updated = [newMember, ...team];
    setStored('team', updated);
    return newMember;
  }

  async getVolunteers(): Promise<Volunteer[]> {
    const backendData = await this.request<any[]>('/volunteers');
    if (backendData && Array.isArray(backendData) && backendData.length > 0) {
      return backendData.map((v, idx) => ({
        id: v.id || `vol_${idx}`,
        name: v.user?.full_name || v.name || 'Volunteer',
        role: v.role || 'Field Incharge',
        ward: v.ward_name || v.ward || 'Ward 02',
        phone: v.user?.phone || v.phone_number || '+91 98290 14285',
        votersAdded: v.total_submissions || v.monthly_collection || 42,
        callsMade: v.calls_made || 65,
        slipsDistributed: v.approved_count || 110,
        status: (v.status === 'ACTIVE' ? 'Active' : 'On-Duty') as any,
        volunteer_code: v.volunteer_code,
        daily_target: v.daily_target || 200,
        monthly_target: v.monthly_target || 5000,
        approved_count: v.approved_count || 0,
      }));
    }
    return getStored<Volunteer[]>('volunteers', INITIAL_VOLUNTEERS);
  }

  async addVolunteer(volunteer: any): Promise<Volunteer> {
    const backendCreated = await this.request<any>('/volunteers', {
      method: 'POST',
      body: JSON.stringify({
        first_name: volunteer.name?.split(' ')[0] || 'Volunteer',
        last_name: volunteer.name?.split(' ')[1] || 'Field',
        email: volunteer.email || `vol_${Date.now()}@electwin.com`,
        phone_number: volunteer.phone || '+919876543210',
        volunteer_code: `VOL-${Math.floor(100 + Math.random() * 900)}`,
        daily_target: volunteer.daily_target || 200,
        monthly_target: volunteer.monthly_target || 5000,
      }),
    });

    if (backendCreated) {
      return {
        id: backendCreated.id,
        name: `${backendCreated.first_name || ''} ${backendCreated.last_name || ''}`.trim(),
        role: 'Field Volunteer',
        ward: volunteer.ward || 'Ward 01',
        phone: backendCreated.phone_number || volunteer.phone,
        votersAdded: 0,
        callsMade: 0,
        slipsDistributed: 0,
        status: 'Active',
        volunteer_code: backendCreated.volunteer_code,
      };
    }

    const volunteers = await this.getVolunteers();
    const newVol: Volunteer = {
      ...volunteer,
      id: `vol_${Date.now()}`,
      votersAdded: 0,
      callsMade: 0,
      slipsDistributed: 0,
      status: 'Active',
    };
    setStored('volunteers', [newVol, ...volunteers]);
    return newVol;
  }

  async getVoters(): Promise<Voter[]> {
    const backendData = await this.request<any>('/data-collection/submissions');
    const items = backendData?.items || backendData;
    if (items && Array.isArray(items) && items.length > 0) {
      return items.map((sub: any, idx: number) => ({
        id: sub.id || `V-${idx}`,
        name: sub.citizen_name || 'Voter',
        age: sub.age || 32,
        gender: (sub.gender === 'FEMALE' ? 'Female' : 'Male') as any,
        ward: sub.ward_no || 'Ward 01',
        mobile: sub.mobile_number || '+91 98290 14285',
        channel: (sub.mobile_number ? 'WhatsApp' : 'SMS Only') as any,
        consent: 'Verified',
        source: 'Field Volunteer App',
        status: sub.is_flagged_duplicate ? 'Duplicate' : 'Valid',
        house: sub.address_line1 || 'Main St',
        voter_id_number: sub.voter_id_number,
        quality_score: sub.quality_score,
      }));
    }
    return getStored<Voter[]>('voters', INITIAL_VOTERS);
  }

  async addVoter(voter: Omit<Voter, 'id'>): Promise<Voter> {
    // 1. Submit to Backend Data Collection Engine
    await this.request('/data-collection/submissions', {
      method: 'POST',
      body: JSON.stringify({
        citizen_name: voter.name,
        mobile_number: voter.mobile?.replace(/\D/g, '').slice(-10) || '9876543210',
        voter_id_number: voter.voter_id_number || `EPIC${Math.floor(100000 + Math.random() * 900000)}`,
        age: voter.age || 25,
        gender: voter.gender?.toUpperCase() || 'MALE',
        ward_no: voter.ward || 'Ward-01',
        address_line1: voter.house || 'Gram Panchayat',
      }),
    });

    const voters = await this.getVoters();
    const newVoter: Voter = {
      ...voter,
      id: `V-${Date.now().toString().slice(-4)}`,
      quality_score: 95.0,
    };
    const updated = [newVoter, ...voters];
    setStored('voters', updated);
    return newVoter;
  }

  async addVotersBatch(newVoters: Omit<Voter, 'id'>[]): Promise<Voter[]> {
    for (const v of newVoters) {
      await this.addVoter(v);
    }
    return this.getVoters();
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
      smsPercent: Math.round((sms / total) * 100),
    };
  }

  async getDeliveryLogs(): Promise<DeliveryLog[]> {
    return getStored<DeliveryLog[]>('delivery_logs', INITIAL_DELIVERY_LOGS);
  }

  async sendBroadcast(payload: BroadcastPayload): Promise<{ success: boolean; count: number }> {
    await this.request('/notifications/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Campaign Broadcast',
        channel: payload.channel === 'whatsapp' ? 'WHATSAPP' : 'SMS',
        message_body: payload.message || 'Important update regarding the upcoming election.',
        recipient_filter: { wards: payload.selectedWards || [] },
      }),
    });

    const voters = await this.getVoters();
    const newLogs: DeliveryLog[] = voters.slice(0, 8).map((v, idx) => ({
      id: `log_${Date.now()}_${idx}`,
      name: v.name,
      ward: v.ward,
      mobile: v.mobile || '+91 98000 00000',
      route: v.channel === 'WhatsApp' ? 'WhatsApp' : 'SMS Fallback',
      status: 'Delivered',
      read: v.channel === 'WhatsApp' ? 'Delivered ✓✓' : 'N/A (SMS)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
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
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
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
      utilizedPercent,
    };
  }

  async getBooths(): Promise<Booth[]> {
    const backendData = await this.request<any[]>('/booths/booths');
    if (backendData && Array.isArray(backendData) && backendData.length > 0) {
      return backendData.map((b) => ({
        boothNo: b.booth_number || '01',
        location: b.name || 'Govt Senior Secondary School',
        incharge: b.incharge_name || 'Rameshwar Meena',
        voters: b.target || 850,
        slips: b.collected_count || 620,
        coverage: `${Math.round((b.collected_count / (b.target || 1)) * 100)}%`,
        target: b.target,
        collected: b.collected_count,
      }));
    }
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
      id: `V-02-${Math.floor(100 + Math.random() * 900)}`,
    };
    const updated = [newVoter, ...list];
    setStored('volunteer_voters', updated);
    return newVoter;
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const backendCharts = await this.request<any>('/analytics/charts');
    if (backendCharts) {
      return {
        wardCoverage: [
          { ward: 'Ward 01', percentage: 78 },
          { ward: 'Ward 02', percentage: 86 },
          { ward: 'Ward 03', percentage: 64 },
          { ward: 'Ward 04', percentage: 94 },
          { ward: 'Ward 05', percentage: 72 },
          { ward: 'Ward 06', percentage: 81 },
        ],
        channelDelivery: [
          { channel: 'WhatsApp', count: backendCharts.communication_delivery_rates?.whatsapp?.sent || 2850, color: '#059669' },
          { channel: 'SMS Fallback', count: backendCharts.communication_delivery_rates?.sms?.sent || 612, color: '#0284c7' },
          { channel: 'Failed', count: 38, color: '#e11d48' },
        ],
        materialPrints: [
          { type: 'A5 Handbill Pamphlets', count: 5200 },
          { type: 'Flex Road Banners (3x6ft)', count: 48 },
          { type: 'Panna Pocket Slips', count: 3500 },
          { type: 'Digital WhatsApp Cards', count: 1840 },
        ],
        volunteerProductivity: (backendCharts.volunteer_performance || []).slice(0, 4).map((v: any) => ({
          name: v.name || 'Volunteer',
          slips: v.collected || 400,
          calls: v.approved || 250,
        })),
      };
    }

    return {
      wardCoverage: [
        { ward: 'Ward 01', percentage: 78 },
        { ward: 'Ward 02', percentage: 86 },
        { ward: 'Ward 03', percentage: 64 },
        { ward: 'Ward 04', percentage: 94 },
        { ward: 'Ward 05', percentage: 72 },
        { ward: 'Ward 06', percentage: 81 },
      ],
      channelDelivery: [
        { channel: 'WhatsApp', count: 2850, color: '#059669' },
        { channel: 'SMS Fallback', count: 612, color: '#0284c7' },
        { channel: 'Failed', count: 38, color: '#e11d48' },
      ],
      materialPrints: [
        { type: 'A5 Handbill Pamphlets', count: 5200 },
        { type: 'Flex Road Banners (3x6ft)', count: 48 },
        { type: 'Panna Pocket Slips', count: 3500 },
        { type: 'Digital WhatsApp Cards', count: 1840 },
      ],
      volunteerProductivity: [
        { name: 'Kailash Saini', slips: 540, calls: 320 },
        { name: 'Priya Sharma', slips: 680, calls: 480 },
        { name: 'Mukesh Gurjar', slips: 420, calls: 290 },
        { name: 'Mahesh Sharma', slips: 390, calls: 210 },
      ],
    };
  }

  // Task Management (Section 7.5 of PDF)
  async getTasks(): Promise<Task[]> {
    const backendData = await this.request<any[]>('/tasks');
    if (backendData && Array.isArray(backendData) && backendData.length > 0) {
      return backendData.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        priority: t.priority,
        status: t.status,
        deadline: t.deadline || 'Soon',
        assignedTo: t.assigned_to_id || 'vol_01',
        assignedVolunteerName: t.assigned_volunteer_name || 'Assigned Volunteer',
        wardOrBooth: t.ward_or_booth || 'Ward 01',
        category: t.category || 'Voter Contact',
        createdDate: new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        completedDate: t.completed_at ? new Date(t.completed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined
      }));
    }
    return getStored<Task[]>('tasks', INITIAL_TASKS);
  }

  async addTask(task: Omit<Task, 'id' | 'createdDate'>): Promise<Task> {
    const backendCreated = await this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        deadline: task.deadline,
        assigned_volunteer_name: task.assignedVolunteerName,
        ward_or_booth: task.wardOrBooth,
        category: task.category
      })
    });

    if (backendCreated) {
      return {
        id: backendCreated.id,
        title: backendCreated.title,
        description: backendCreated.description || '',
        priority: backendCreated.priority,
        status: backendCreated.status,
        deadline: backendCreated.deadline,
        assignedTo: task.assignedTo,
        assignedVolunteerName: backendCreated.assigned_volunteer_name,
        wardOrBooth: backendCreated.ward_or_booth,
        category: backendCreated.category,
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
    }

    const list = await this.getTasks();
    const newTask: Task = {
      ...task,
      id: `tsk_${Date.now().toString().slice(-4)}`,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const updated = [newTask, ...list];
    setStored('tasks', updated);
    return newTask;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    await this.request<any>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    const list = await this.getTasks();
    const item = list.find(t => t.id === id);
    if (item) {
      item.status = status;
      if (status === 'completed') {
        item.completedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      setStored('tasks', list);
      return item;
    }
    return null;
  }

  // Field Activities (Section 7.7 of PDF)
  async getFieldActivities(): Promise<FieldActivity[]> {
    const backendData = await this.request<any[]>('/field-activities');
    if (backendData && Array.isArray(backendData) && backendData.length > 0) {
      return backendData.map((a) => ({
        id: a.id,
        volunteerId: a.volunteer_id || 'vol_01',
        volunteerName: a.volunteer_name,
        ward: a.ward || 'Ward 01',
        boothNo: a.booth_no || 'Booth 01',
        activityType: a.activity_type as any,
        location: a.location,
        dateTime: a.date_time || 'Recent',
        description: a.description,
        photoUrl: a.photo_url,
        votersContacted: a.voters_contacted,
        slipsDistributed: a.slips_distributed,
        status: a.status
      }));
    }
    return getStored<FieldActivity[]>('field_activities', INITIAL_FIELD_ACTIVITIES);
  }

  async addFieldActivity(activity: Omit<FieldActivity, 'id' | 'dateTime' | 'status'>): Promise<FieldActivity> {
    await this.request<any>('/field-activities', {
      method: 'POST',
      body: JSON.stringify({
        volunteer_name: activity.volunteerName,
        ward: activity.ward,
        booth_no: activity.boothNo,
        activity_type: activity.activityType,
        location: activity.location,
        description: activity.description,
        photo_url: activity.photoUrl,
        voters_contacted: activity.votersContacted,
        slips_distributed: activity.slipsDistributed
      })
    });

    const list = await this.getFieldActivities();
    const newAct: FieldActivity = {
      ...activity,
      id: `act_${Date.now().toString().slice(-4)}`,
      dateTime: 'Just now',
      status: 'Submitted'
    };
    const updated = [newAct, ...list];
    setStored('field_activities', updated);
    return newAct;
  }

  // Attendance & Check-in (Section 7.7 of PDF)
  async getAttendance(): Promise<AttendanceRecord[]> {
    const backendData = await this.request<any[]>('/attendance');
    if (backendData && Array.isArray(backendData) && backendData.length > 0) {
      return backendData.map((att) => ({
        id: att.id,
        volunteerId: att.volunteer_id || 'vol_01',
        volunteerName: att.volunteer_name,
        ward: att.ward || 'Ward 01',
        date: att.date,
        checkInTime: att.check_in_time,
        checkOutTime: att.check_out_time,
        location: att.location,
        status: att.status
      }));
    }
    return getStored<AttendanceRecord[]>('attendance', INITIAL_ATTENDANCE);
  }

  async logAttendance(volunteerId: string, volunteerName: string, ward: string, location: string): Promise<AttendanceRecord> {
    await this.request<any>('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({
        volunteer_name: volunteerName,
        ward,
        location
      })
    });

    const list = await this.getAttendance();
    const newAtt: AttendanceRecord = {
      id: `att_${Date.now().toString().slice(-4)}`,
      volunteerId,
      volunteerName,
      ward,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location,
      status: 'Present'
    };
    const updated = [newAtt, ...list];
    setStored('attendance', updated);
    return newAtt;
  }

  // Subscription & SaaS Revenue (Section 11, 12, 17 of PDF)
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const backendPlans = await this.request<SubscriptionPlan[]>('/subscriptions/plans');
    if (backendPlans && Array.isArray(backendPlans) && backendPlans.length > 0) {
      return backendPlans;
    }
    return INITIAL_SUBSCRIPTION_PLANS;
  }

  async getCurrentSubscription(): Promise<CurrentSubscription> {
    const backendSub = await this.request<CurrentSubscription>('/subscriptions/current');
    if (backendSub) {
      return backendSub;
    }
    return getStored<CurrentSubscription>('current_subscription', INITIAL_CURRENT_SUBSCRIPTION);
  }

  async upgradeSubscription(planId: PlanTier, gateway: 'Razorpay' | 'Stripe' | 'Cashfree' | 'PayU' = 'Razorpay'): Promise<CurrentSubscription> {
    const backendSub = await this.request<CurrentSubscription>('/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId, gateway })
    });

    if (backendSub) {
      setStored('current_subscription', backendSub);
      return backendSub;
    }

    const plan = INITIAL_SUBSCRIPTION_PLANS.find(p => p.id === planId) || INITIAL_SUBSCRIPTION_PLANS[1];
    const newSub: CurrentSubscription = {
      planId,
      planName: plan.name,
      status: 'Active',
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      autoRenew: true,
      activeCandidates: planId === 'basic' ? 1 : planId === 'professional' ? 5 : 100,
      activeVolunteers: planId === 'basic' ? 10 : planId === 'professional' ? 50 : 1000,
      whatsappCredits: planId === 'basic' ? 1000 : planId === 'professional' ? 10000 : 50000,
      smsCredits: planId === 'basic' ? 500 : planId === 'professional' ? 2500 : 10000
    };
    setStored('current_subscription', newSub);

    // Record invoice
    const invoices = await this.getInvoices();
    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      planName: `${plan.name} (Monthly)`,
      amount: plan.priceMonthly,
      status: 'Paid',
      gateway,
      transactionId: `pay_${gateway.toLowerCase()}_${Date.now().toString().slice(-8)}`
    };
    setStored('invoices', [newInvoice, ...invoices]);
    return newSub;
  }

  async getInvoices(): Promise<Invoice[]> {
    const backendInvoices = await this.request<Invoice[]>('/subscriptions/invoices');
    if (backendInvoices && Array.isArray(backendInvoices) && backendInvoices.length > 0) {
      return backendInvoices;
    }
    return getStored<Invoice[]>('invoices', INITIAL_INVOICES);
  }
}

export const api = new ApiService();


