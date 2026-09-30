const API_BASE = 'http://localhost:8000/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('civicai_officer_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('civicai_officer_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('civicai_officer_token');
  localStorage.removeItem('civicai_officer_user');
};

const authHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async login(email: string, password: str) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    setAuthToken(data.access_token);
    localStorage.setItem('civicai_officer_user', JSON.stringify(data.user));
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async getWardSummary() {
    const res = await fetch(`${API_BASE}/area-officer/ward-summary`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to load ward summary');
    return res.json();
  },

  async getWardIssues() {
    const res = await fetch(`${API_BASE}/complaints`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to load issues');
    return res.json();
  },

  async getIssue(id: string) {
    const res = await fetch(`${API_BASE}/complaints/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to load issue');
    return res.json();
  },

  async updateStatus(id: string, status: string, notes?: string) {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async getFieldTeams() {
    const res = await fetch(`${API_BASE}/area-officer/field-teams`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to load field teams');
    return res.json();
  },

  async assignTeam(id: string, teamId: string, teamName: string, instructions?: string) {
    const res = await fetch(`${API_BASE}/complaints/${id}/assign`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ team_id: teamId, team_name: teamName, instructions }),
    });
    if (!res.ok) throw new Error('Failed to assign team');
    return res.json();
  },

  async escalate(id: string, reason: string, targetLevel: number = 2) {
    const res = await fetch(`${API_BASE}/complaints/${id}/escalate`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ reason, target_level: targetLevel }),
    });
    if (!res.ok) throw new Error('Failed to escalate complaint');
    return res.json();
  },

  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, { headers: authHeaders() });
    if (!res.ok) return [];
    return res.json();
  }
};
