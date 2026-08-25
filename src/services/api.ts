/**
 * api.ts — ElectWin Dashboard
 * All methods make real HTTP calls to the FastAPI backend.
 * Zero localStorage / mockData references.
 */
import { httpClient } from './httpClient';

// ─── Helper: unwrap APIResponse<T> envelope ───────────────────────────────────
function unwrap<T>(res: { data: { data: T; success?: boolean; message?: string } | T }): T {
  const body = res.data as any;
  // Backend wraps in {success, message, data: T}
  if (body && 'data' in body && body.success !== undefined) return body.data as T;
  return body as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  onboard: async (payload: { organization_name: string; email: string; password: string; first_name: string; last_name: string; phone?: string }) => {
    const res = await httpClient.post('/auth/onboard', payload);
    return unwrap<{ access_token: string; refresh_token: string; expires_in: number; user: Record<string, any> }>(res);
  },
  requestSignupOtp: async (payload: { full_name?: string; email: string; password: string; phone?: string }) => {
    const res = await httpClient.post('/auth/signup/request-otp', payload);
    return unwrap<{ challenge_id: string; destination: string; expires_in: number; dev_code?: string }>(res);
  },
  verifySignupOtp: async (challenge_id: string, code: string) => {
    const res = await httpClient.post('/auth/signup/verify-otp', { challenge_id, code });
    return unwrap<{ access_token: string; refresh_token: string; expires_in: number; user: Record<string, any> }>(res);
  },
  register: async (payload: { email: string; password: string; first_name: string; last_name: string; phone?: string }) => {
    const res = await httpClient.post('/auth/register', payload);
    return unwrap<Record<string, any>>(res);
  },
  login: async (identifier: string, password: string) => {
    const isPhone = !identifier.includes('@');
    const res = await httpClient.post('/auth/login', { [isPhone ? 'phone' : 'email']: identifier, password });
    return unwrap<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      user: Record<string, any>;
    }>(res);
  },
  googleAuth: async (credential: string) => {
    const res = await httpClient.post('/auth/google', { credential });
    return unwrap<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      user: Record<string, any>;
    }>(res);
  },
  requestLoginOtp: async (identifier: string, password: string) => {
    const isPhone = !identifier.includes('@');
    const res = await httpClient.post('/auth/login/request-otp', { [isPhone ? 'phone' : 'email']: identifier, password });
    return unwrap<{ challenge_id: string; destination: string; expires_in: number; dev_code?: string }>(res);
  },
  verifyLoginOtp: async (challenge_id: string, code: string, identifier: string, password: string) => {
    const isPhone = !identifier.includes('@');
    const res = await httpClient.post('/auth/login/verify-otp', { challenge_id, code, [isPhone ? 'phone' : 'email']: identifier, password });
    return unwrap<{ access_token: string; refresh_token: string; expires_in: number; user: Record<string, any> }>(res);
  },
  refresh: async (refresh_token: string) => {
    const res = await httpClient.post('/auth/refresh', { refresh_token });
    return unwrap<{ access_token: string; refresh_token: string }>(res);
  },
  logout: async (refresh_token: string) => {
    await httpClient.post('/auth/logout', { refresh_token });
  },
  getMe: async () => {
    const res = await httpClient.get('/users/me');
    return unwrap<Record<string, any>>(res);
  },
  setupMfa: async () => {
    const res = await httpClient.post('/auth/mfa/setup');
    return unwrap<{ secret: string; provisioning_uri: string; recovery_codes: string[] }>(res);
  },
  confirmMfa: async (totp_code: string) => {
    const res = await httpClient.post('/auth/mfa/confirm', { totp_code });
    return unwrap<boolean>(res);
  },
};

// ─── Tasks & Field Activities ────────────────────────────────────────────────
export const tasksApi = {
  list: async (params?: { status?: string; priority?: string; mine?: boolean }) => {
    const res = await httpClient.get('/tasks', { params });
    return (unwrap<any>(res) ?? []) as any[];
  },
  create: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/tasks', payload);
    return unwrap<any>(res);
  },
  update: async (id: string, payload: Record<string, any>) => {
    const res = await httpClient.put(`/tasks/${id}`, payload);
    return unwrap<any>(res);
  },
  updateStatus: async (id: string, status: string) => {
    const res = await httpClient.patch(`/tasks/${id}/status`, { status });
    return unwrap<any>(res);
  },
  remove: async (id: string) => {
    await httpClient.delete(`/tasks/${id}`);
  },
};

export const fieldActivitiesApi = {
  list: async (params?: { ward?: string; activity_type?: string; status?: string; mine?: boolean }) => {
    const res = await httpClient.get('/field-activities', { params });
    return (unwrap<any>(res) ?? []) as any[];
  },
  submit: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/field-activities', payload);
    return unwrap<any>(res);
  },
  updateStatus: async (id: string, status: string) => {
    const path = status === 'Verified' ? 'approve' : status === 'Flagged' ? 'reject' : 'status';
    const res = path === 'status'
      ? await httpClient.patch(`/field-activities/${id}/status`, { status })
      : await httpClient.put(`/field-activities/${id}/${path}`);
    return unwrap<any>(res);
  },
  remove: async (id: string) => {
    await httpClient.delete(`/field-activities/${id}`);
  },
};

// ─── Elections ────────────────────────────────────────────────────────────────
export const electionsApi = {
  list: async () => {
    const res = await httpClient.get('/elections/');
    const data = unwrap<any>(res);
    return (data?.items ?? data ?? []) as any[];
  },
  create: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/elections/', payload);
    return unwrap<any>(res);
  },
  get: async (id: string) => {
    const res = await httpClient.get(`/elections/${id}`);
    return unwrap<any>(res);
  },
  update: async (id: string, payload: Record<string, any>) => {
    const res = await httpClient.put(`/elections/${id}`, payload);
    return unwrap<any>(res);
  },
};

// ─── Organizations ────────────────────────────────────────────────────────────
export const orgsApi = {
  list: async () => {
    const res = await httpClient.get('/organizations/');
    const data = unwrap<any>(res);
    return (data?.items ?? data ?? []) as any[];
  },
  create: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/organizations/', payload);
    return unwrap<any>(res);
  },
};

export const candidatesApi = {
  list: async (election_id?: string, params?: Record<string, any>) => {
    const res = election_id
      ? await httpClient.get(`/candidates/election/${election_id}`, { params })
      : await httpClient.get('/candidates', { params });
    const data = unwrap<any>(res);
    const items = (data?.items ?? (Array.isArray(data) ? data : [])) as any[];
    return { items, pagination: data?.pagination };
  },
  create: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/candidates/', payload);
    return unwrap<any>(res);
  },
  update: async (id: string, payload: Record<string, any>) => {
    const res = await httpClient.put(`/candidates/${id}`, payload);
    return unwrap<any>(res);
  },
  remove: async (id: string) => {
    const res = await httpClient.delete(`/candidates/${id}`);
    return unwrap<boolean>(res);
  },
  updateStatus: async (id: string, status: string, rejection_reason?: string) => {
    const res = await httpClient.post(`/candidates/${id}/status`, { status, rejection_reason });
    return unwrap<any>(res);
  },
};

// ─── Voters ───────────────────────────────────────────────────────────────────
export const votersApi = {
  list: async (election_id?: string, params?: Record<string, any>) => {
    try {
      if (election_id) {
        const res = await httpClient.get(`/voters/election/${election_id}`, { params });
        const data = unwrap<any>(res);
        return { items: (data?.items ?? (Array.isArray(data) ? data : [])) as any[], pagination: data?.pagination };
      }
    } catch (error) {
      if ((error as any)?.response?.status !== 404) throw error;
    }

    const res = await httpClient.get('/voters/', { params });
    const data = unwrap<any>(res);
    return { items: (Array.isArray(data) ? data : (data?.items ?? [])) as any[], pagination: data?.pagination };
  },

  create: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/voters/', payload);
    return unwrap<any>(res);
  },
  update: async (id: string, payload: Record<string, any>) => {
    const res = await httpClient.put(`/voters/${id}`, payload);
    return unwrap<any>(res);
  },
  delete: async (id: string) => {
    const res = await httpClient.delete(`/voters/${id}`);
    return unwrap<any>(res);
  },
  deleteBulk: async (voter_ids: string[]) => {
    const res = await httpClient.delete('/voters/bulk', { data: { voter_ids } });
    return unwrap<any>(res);
  },
  verify: async (voter_id: string, payload: Record<string, any>) => {
    const res = await httpClient.post(`/voters/${voter_id}/verify`, payload);
    return unwrap<any>(res);
  },
  uploadBatch: async (election_id: string, file: File) => {
    const form = new FormData();
    form.append('election_id', election_id);
    form.append('file', file);
    const res = await httpClient.post('/imports/upload', form);
    return unwrap<any>(res); // ImportPreviewResponse
  },
  confirmImport: async (job_id: string) => {
    const res = await httpClient.post('/imports/confirm', { job_id });
    return unwrap<any>(res); // ImportReportResponse
  },
  cancelImport: async (job_id: string) => {
    const res = await httpClient.delete(`/imports/${job_id}`);
    return unwrap<any>(res);
  },
  checkin: async (payload: {
    voter_id: string;
    election_id: string;
    polling_station_id: string;
    checkin_method?: string;
  }) => {
    const res = await httpClient.post('/checkin/', payload);
    return unwrap<any>(res);
  },
};

export const broadcastGroupsApi = {
  list: async () => {
    const res = await httpClient.get('/broadcast/groups');
    return (unwrap<any>(res) ?? []) as any[];
  },
  deleteGroup: async (id: string) => {
    const res = await httpClient.delete(`/broadcast/groups/${id}`);
    return unwrap<any>(res);
  },
  bulkDeleteGroups: async (group_ids: string[]) => {
    const res = await httpClient.delete('/broadcast/groups/bulk', { data: { group_ids } });
    return unwrap<any>(res);
  },
  create: async (payload: { name?: string; voter_ids: string[]; channel_overrides?: Record<string, 'whatsapp' | 'sms'>; filter_criteria_snapshot: Record<string, unknown> }) => {
    const res = await httpClient.post('/broadcast/groups', payload);
    return unwrap<any>(res);
  },
  saveDraft: async (id: string, message_text: string) => {
    const res = await httpClient.patch(`/broadcast/groups/${id}/draft`, { message_text });
    return unwrap<any>(res);
  },
  send: async (id: string) => {
    const res = await httpClient.post(`/broadcast/${id}/send`);
    return unwrap<any>(res);
  },
  results: async (id: string) => {
    const res = await httpClient.get(`/broadcast/${id}/results`);
    return unwrap<any>(res);
  },
  logs: async (id: string) => {
    const res = await httpClient.get(`/broadcast/${id}/logs`);
    return (unwrap<any>(res) ?? []) as any[];
  },
};

// ─── Users / Team ─────────────────────────────────────────────────────────────
export const usersApi = {
  list: async (params?: Record<string, any>) => {
    const res = await httpClient.get('/users/', { params });
    const data = unwrap<any>(res);
    return { items: (data?.items ?? data ?? []) as any[], pagination: data?.pagination };
  },
  create: async (payload: Record<string, any>) => {
    // Sanitize payload to match backend `UserCreate` schema
    const body = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      password: payload.password,
      phone: payload.phone ?? null,
      ward: payload.ward ?? null,
      role_code: (payload.role_code ?? payload.role ?? 'VOLUNTEER').toString().toUpperCase(),
      organization_id: payload.organization_id ?? null,
    };
    const res = await httpClient.post('/users/', body);
    return unwrap<any>(res);
  },
  update: async (id: string, payload: Record<string, any>) => {
    const res = await httpClient.put(`/users/${id}`, payload);
    return unwrap<any>(res);
  },
  remove: async (id: string) => {
    const res = await httpClient.delete(`/users/${id}`);
    return unwrap<any>(res);
  },
  purge: async (id: string) => {
    const res = await httpClient.delete(`/users/${id}/purge`);
    return unwrap<any>(res);
  },
  getRoles: async () => {
    const res = await httpClient.get('/users/roles/all');
    return unwrap<any[]>(res) ?? [];
  },
  getPermissions: async () => {
    const res = await httpClient.get('/users/permissions/all');
    return unwrap<any[]>(res) ?? [];
  },
};

// ─── Volunteers & Polling Stations ────────────────────────────────────────────
export const volunteersApi = {
  listAssignments: async (election_id: string, polling_station_id?: string) => {
    const params: any = {};
    if (polling_station_id) params.polling_station_id = polling_station_id;
    const res = await httpClient.get(`/volunteers/election/${election_id}`, { params });
    return (unwrap<any>(res) ?? []) as any[];
  },
  assign: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/volunteers/assign', payload);
    return unwrap<any>(res);
  },
  updateStatus: async (assignment_id: string, payload: Record<string, any>) => {
    const res = await httpClient.put(`/volunteers/assignments/${assignment_id}`, payload);
    return unwrap<any>(res);
  },
  listPollingStations: async (election_id: string) => {
    const res = await httpClient.get(`/polling-stations/election/${election_id}`);
    const data = unwrap<any>(res);
    return (data?.items ?? data ?? []) as any[];
  },
  createPollingStation: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/polling-stations/', payload);
    return unwrap<any>(res);
  },
};

// ─── Volunteer Voters (Field Canvassing) ──────────────────────────────────────
export const volunteerVotersApi = {
  list: async () => {
    const res = await httpClient.get('/volunteer-voters');
    return (unwrap<any>(res) ?? []) as any[];
  },
  create: async (payload: { name: string; age: number; mobile?: string; house?: string; status?: string; slipHanded?: boolean }) => {
    const res = await httpClient.post('/volunteer-voters', payload);
    return unwrap<any>(res);
  },
  updateStatus: async (id: string, status: string, slipHanded?: boolean) => {
    const res = await httpClient.put(`/volunteer-voters/${id}/status`, { status, slipHanded });
    return unwrap<any>(res);
  },
};

// ─── Notifications / Broadcast ────────────────────────────────────────────────
export const notificationsApi = {
  listTemplates: async () => {
    const res = await httpClient.get('/notifications/templates');
    return (unwrap<any>(res) ?? []) as any[];
  },
  createTemplate: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/notifications/templates', payload);
    return unwrap<any>(res);
  },
  sendDirect: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/notifications/send', payload);
    return unwrap<any>(res);
  },
  createCampaign: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/notifications/campaigns', payload);
    return unwrap<any>(res);
  },
  getCampaignReport: async (campaign_id: string) => {
    const res = await httpClient.get(`/notifications/campaigns/${campaign_id}/report`);
    return unwrap<any>(res);
  },
  listMyNotifications: async () => {
    const res = await httpClient.get('/notifications/my');
    return (unwrap<any>(res) ?? []) as any[];
  },
  markAsRead: async (notification_id: string) => {
    const res = await httpClient.patch(`/notifications/${notification_id}/read`);
    return unwrap<any>(res);
  },
  markAllAsRead: async () => {
    const res = await httpClient.post('/notifications/mark-all-read');
    return unwrap<any>(res);
  },
  deleteNotification: async (notification_id: string) => {
    const res = await httpClient.delete(`/notifications/${notification_id}`);
    return unwrap<any>(res);
  },
};

export const broadcastApi = {
  audience: async () => {
    const res = await httpClient.get('/broadcast/audience-split');
    return unwrap<any>(res);
  },
  send: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/broadcast/send', payload);
    return unwrap<any>(res);
  },

  deliveryLogs: async () => {
    const res = await httpClient.get('/broadcast/delivery-logs');
    return (unwrap<any>(res) ?? []) as any[];
  },
};

// ─── Complaints ───────────────────────────────────────────────────────────────
export const complaintsApi = {
  list: async (election_id: string, params?: Record<string, any>) => {
    const res = await httpClient.get(`/complaints/election/${election_id}`, { params });
    const data = unwrap<any>(res);
    return { items: (data?.items ?? (Array.isArray(data) ? data : [])) as any[], pagination: data?.pagination };
  },
  create: async (election_id: string, payload: Record<string, any>) => {
    const res = await httpClient.post(`/complaints/election/${election_id}`, payload);
    return unwrap<any>(res);
  },
  updateStatus: async (id: string, payload: Record<string, any>) => {
    const res = await httpClient.put(`/complaints/${id}/status`, payload);
    return unwrap<any>(res);
  },
  update: async (id: string, payload: Record<string, any>) => {
    const res = await httpClient.put(`/complaints/${id}`, payload);
    return unwrap<any>(res);
  },
  remove: async (id: string) => {
    const res = await httpClient.delete(`/complaints/${id}`);
    return unwrap<any>(res);
  },
};

// ─── Expenses ─────────────────────────────────────────────────────────────────
export const expensesApi = {
  list: async (election_id: string, params?: Record<string, any>) => {
    const res = await httpClient.get(`/expenses/election/${election_id}`, { params });
    const data = unwrap<any>(res);
    return { items: (data?.items ?? (Array.isArray(data) ? data : [])) as any[], pagination: data?.pagination };
  },
  create: async (election_id: string, payload: Record<string, any>) => {
    const res = await httpClient.post(`/expenses/election/${election_id}`, payload);
    return unwrap<any>(res);
  },
  remove: async (id: string) => {
    await httpClient.delete(`/expenses/${id}`);
  },

  getBudgetSummary: async (election_id: string) => {
    const res = await httpClient.get(`/expenses/election/${election_id}/summary`);
    const d = unwrap<any>(res);
    return {
      budget_limit: d?.budgetLimit ?? d?.budget_limit ?? 150000,
      total_spent: d?.totalSpent ?? d?.total_spent ?? 0,
      remaining: d?.remaining ?? 0,
      utilized_percent: d?.utilizedPercent ?? d?.utilized_percent ?? 0,
      expense_count: d?.expenseCount ?? d?.expense_count ?? 0,
    };
  },
};


// ─── Analytics & Dashboard ────────────────────────────────────────────────────
export const analyticsApi = {
  getTurnout: async (election_id: string) => {
    const res = await httpClient.get(`/analytics/election/${election_id}/turnout`);
    return unwrap<any>(res);
  },
  getDashboardSuperAdmin: async (election_id?: string | null) => {
    const res = await httpClient.get('/dashboard/superadmin', { params: election_id ? { election_id } : undefined });
    return unwrap<any>(res);
  },
  getDashboardAdmin: async (election_id: string) => {
    const res = await httpClient.get(`/dashboard/admin/${election_id}`);
    return unwrap<any>(res);
  },
  getDashboardVolunteer: async () => {
    const res = await httpClient.get('/dashboard/volunteer');
    return unwrap<any>(res);
  },
};

// ─── Results ──────────────────────────────────────────────────────────────────
export const resultsApi = {
  getForElection: async (election_id: string) => {
    const res = await httpClient.get(`/results/election/${election_id}`);
    return unwrap<any>(res);
  },
  tally: async (election_id: string) => {
    const res = await httpClient.post('/results/tally', { election_id });
    return unwrap<any>(res);
  },
  publish: async (election_id: string) => {
    const res = await httpClient.post('/results/publish', { election_id });
    return unwrap<any>(res);
  },
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const auditApi = {
  list: async (params?: Record<string, any>) => {
    const res = await httpClient.get('/audit-logs', { params });
    const data = unwrap<any>(res);
    return { items: (data?.items ?? []) as any[], pagination: data?.pagination };
  },
};

// ─── Design Templates & Digital Studio ────────────────────────────────────────
export const designTemplatesApi = {
  list: async (params?: { election_type?: string; category?: string }) => {
    const res = await httpClient.get('/design-templates/', { params });
    return (unwrap<any>(res) ?? []) as any[];
  },
  get: async (id: string) => {
    const res = await httpClient.get(`/design-templates/${id}`);
    return unwrap<any>(res);
  },
  create: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/design-templates/', payload);
    return unwrap<any>(res);
  },
  saveDesign: async (payload: {
    template_id: string;
    election_id?: string;
    candidate_id?: string;
    title: string;
    form_data: Record<string, any>;
    preview_image_url?: string;
    canvas_json?: Record<string, any>;
  }) => {
    const res = await httpClient.post('/design-templates/designs', payload);
    return unwrap<any>(res);
  },
  listMyDesigns: async () => {
    const res = await httpClient.get('/design-templates/designs/my');
    return (unwrap<any>(res) ?? []) as any[];
  },
  listSharedDesigns: async () => {
    const res = await httpClient.get('/posters/shared-with-me');
    return (unwrap<any>(res) ?? []) as any[];
  },
  shareDesign: async (id: string, recipient_ids: string[]) => {
    const res = await httpClient.post(`/posters/${id}/share`, { recipient_ids });
    return unwrap<any>(res);
  },
  deleteDesign: async (id: string) => {
    const res = await httpClient.delete(`/design-templates/designs/${id}`);
    return unwrap<any>(res);
  },
  uploadAsset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await httpClient.post('/design-templates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrap<{ url: string; filename: string }>(res);
  },
};


// ─── Positions & Constituencies ───────────────────────────────────────────────
export const positionsApi = {
  list: async (election_id: string) => {
    const res = await httpClient.get(`/positions/election/${election_id}`);
    const data = unwrap<any>(res);
    return (data?.items ?? data ?? []) as any[];
  },
  create: async (payload: Record<string, any>) => {
    const res = await httpClient.post('/positions/', payload);
    return unwrap<any>(res);
  },
};

export const constituenciesApi = {
  list: async (election_id: string) => {
    const res = await httpClient.get(`/constituencies/election/${election_id}`);
    const data = unwrap<any>(res);
    return (data?.items ?? data ?? []) as any[];
  },
};

// ─── Legacy default export (for pages still importing `api.`) ────────────────
// This thin adapter bridges old page code to new named exports above.
class ApiService {
  // Auth
  login = authApi.login;
  logout = authApi.logout;
  getMe = authApi.getMe;

  // Candidates
  async getCandidates(election_id?: string) {
    if (!election_id) return [] as any[];
    const { items } = await candidatesApi.list(election_id);
    return items;
  }
  async addCandidate(payload: Record<string, any>) {
    return candidatesApi.create(payload);
  }

  // Voters
  async getVoters(election_id: string, params?: Record<string, any>) {
    const { items } = await votersApi.list(election_id, params);
    return items;
  }
  async addVoter(payload: Record<string, any>) {
    return votersApi.create(payload);
  }
  async deleteVoter(id: string) {
    return votersApi.delete(id);
  }
  async addVotersBatch(election_id: string, file: File) {
    return votersApi.uploadBatch(election_id, file);
  }
  async uploadVotersFile(election_id: string, file: File) {
    return votersApi.uploadBatch(election_id, file);
  }
  async confirmVotersImport(job_id: string) {
    return votersApi.confirmImport(job_id);
  }
  async cancelVotersImport(job_id: string) {
    return votersApi.cancelImport(job_id);
  }

  // Users / Team
  async getTeamMembers() {
    const { items } = await usersApi.list();
    return items;
  }
  async addTeamMember(payload: Record<string, any>) {
    return usersApi.create(payload);
  }

  // Volunteers
  async getVolunteers(election_id: string) {
    return volunteersApi.listAssignments(election_id);
  }
  async getBooths(election_id: string) {
    return volunteersApi.listPollingStations(election_id);
  }
  async getVolunteerVoters() {
    return volunteerVotersApi.list();
  }
  async addVolunteerVoter(payload: { name: string; age: number; mobile?: string; house?: string; status?: string; slipHanded?: boolean }) {
    return volunteerVotersApi.create(payload);
  }
  async updateVolunteerVoterStatus(id: string, status: string, slipHanded?: boolean) {
    return volunteerVotersApi.updateStatus(id, status, slipHanded);
  }
    async uploadVolunteerVoters(election_id: string, file: File) {
      return votersApi.uploadBatch(election_id, file);
    }
    async confirmVolunteerVoterImport(job_id: string) {
      return votersApi.confirmImport(job_id);
    }
    async cancelVolunteerVoterImport(job_id: string) {
      return votersApi.cancelImport(job_id);
    }

  // Notifications / Broadcast
  async sendBroadcast(payload: Record<string, any>) {
    return broadcastApi.send(payload);
  }
  async getDeliveryLogs(campaign_id?: string) {
    if (campaign_id) return notificationsApi.getCampaignReport(campaign_id);
    return broadcastApi.deliveryLogs();
  }
  async getAudienceSplit(_election_id?: string) {
    return broadcastApi.audience();
  }

  // Complaints
  async getComplaints(election_id: string) {
    const { items } = await complaintsApi.list(election_id);
    return items;
  }
  async addComplaint(election_id: string, payload: Record<string, any>) {
    return complaintsApi.create(election_id, payload);
  }
  async updateComplaintStatus(id: string, status: string) {
    return complaintsApi.updateStatus(id, { status });
  }

  // Expenses
  async getExpenses(election_id: string) {
    const { items } = await expensesApi.list(election_id);
    return items;
  }
  async addExpense(election_id: string, payload: Record<string, any>) {
    return expensesApi.create(election_id, payload);
  }
  async getBudgetSummary(election_id: string) {
    return expensesApi.getBudgetSummary(election_id);
  }

  // Analytics
  async getAnalytics(election_id: string) {
    return analyticsApi.getTurnout(election_id);
  }

  // Design Templates
  async getDesignTemplates(params?: Record<string, any>) {
    return designTemplatesApi.list(params);
  }

  // Subscriptions
  async getSubscriptionPlans() {
    return subscriptionsApi.listPlans();
  }
  async getCurrentSubscription() {
    return subscriptionsApi.getCurrent();
  }
  async getInvoices() {
    return subscriptionsApi.listInvoices();
  }
  async upgradeSubscription(planId: string, gateway: string) {
    return subscriptionsApi.upgrade(planId, gateway);
  }

  // Elections
  async getElections() {
    return electionsApi.list();
  }
}

// ─── Subscriptions API ────────────────────────────────────────────────────────
export const subscriptionsApi = {
  listPlans: async () => {
    const res = await httpClient.get('/subscriptions/plans');
    const data = unwrap<any>(res);
    return (data?.items ?? data ?? []) as any[];
  },
  getCurrent: async () => {
    const res = await httpClient.get('/subscriptions/current');
    return unwrap<any>(res);
  },
  listInvoices: async () => {
    const res = await httpClient.get('/subscriptions/invoices');
    const data = unwrap<any>(res);
    return (data?.items ?? data ?? []) as any[];
  },
  upgrade: async (planId: string, gateway: string) => {
    const res = await httpClient.post('/subscriptions/upgrade', { planId, gateway });
    return unwrap<any>(res);
  },
};

export const api = new ApiService();

