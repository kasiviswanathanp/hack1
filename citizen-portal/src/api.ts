const API_BASE = 'http://localhost:8000/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('civicai_citizen_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('civicai_citizen_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('civicai_citizen_token');
  localStorage.removeItem('civicai_citizen_user');
};

const authHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
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
    localStorage.setItem('civicai_citizen_user', JSON.stringify(data.user));
    return data;
  },

  async register(payload: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    setAuthToken(data.access_token);
    localStorage.setItem('civicai_citizen_user', JSON.stringify(data.user));
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  // Complaints
  async getMyComplaints() {
    const res = await fetch(`${API_BASE}/complaints`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load complaints');
    return res.json();
  },

  async getComplaint(id: string) {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Complaint not found');
    return res.json();
  },

  async createComplaint(payload: any) {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to submit grievance');
    }
    return res.json();
  },

  async rateComplaint(id: string, rating: number, feedback?: string, reopen?: boolean) {
    const res = await fetch(`${API_BASE}/complaints/${id}/rate`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ complaint_id: id, rating, feedback, reopen }),
    });
    if (!res.ok) throw new Error('Failed to submit rating');
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  // AI Assistant
  async analyze(description: string, imageUrl?: string, lat?: number, lng?: number) {
    return {
      category: description.toLowerCase().includes('drain') ? 'Drainage' : description.toLowerCase().includes('water') ? 'Water' : 'Road',
      confidence: 0.94,
    };
  }
};
