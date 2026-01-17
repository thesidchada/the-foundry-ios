import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-app.replit.app';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

let sessionCookie: string | null = null;

export async function setSessionCookie(cookie: string) {
  sessionCookie = cookie;
  await SecureStore.setItemAsync('session_cookie', cookie);
}

export async function getSessionCookie(): Promise<string | null> {
  if (sessionCookie) return sessionCookie;
  sessionCookie = await SecureStore.getItemAsync('session_cookie');
  return sessionCookie;
}

export async function clearSession() {
  sessionCookie = null;
  await SecureStore.deleteItemAsync('session_cookie');
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const cookie = await getSessionCookie();

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { 'Cookie': cookie } : {}),
      ...headers,
    },
    credentials: 'include',
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text);
}

export const api = {
  protocols: {
    getByDate: (date: string) => apiClient<any[]>(`/api/protocols/${date}`),
    create: (data: any) => apiClient<any>('/api/protocols', { method: 'POST', body: data }),
    update: (id: string, data: any) => apiClient<any>(`/api/protocols/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) => apiClient<void>(`/api/protocols/${id}`, { method: 'DELETE' }),
  },
  bookings: {
    getAll: () => apiClient<any[]>('/api/bookings'),
    create: (data: any) => apiClient<any>('/api/bookings', { method: 'POST', body: data }),
    update: (id: string, status: string) => apiClient<any>(`/api/bookings/${id}`, { method: 'PATCH', body: { status } }),
    delete: (id: string) => apiClient<void>(`/api/bookings/${id}`, { method: 'DELETE' }),
  },
  healthMetrics: {
    getRange: (startDate: string, endDate: string) => 
      apiClient<any[]>(`/api/metrics?startDate=${startDate}&endDate=${endDate}`),
    getByDate: (date: string) => apiClient<any>(`/api/metrics/${date}`),
    upsert: (data: any) => apiClient<any>('/api/metrics', { method: 'POST', body: data }),
  },
  biomarkers: {
    getAll: () => apiClient<any[]>('/api/biomarkers'),
    create: (data: any) => apiClient<any>('/api/biomarkers', { method: 'POST', body: data }),
  },
  achievements: {
    getAll: () => apiClient<any[]>('/api/achievements'),
    getProgress: () => apiClient<any[]>('/api/achievements/progress'),
    getDefinitions: () => apiClient<any[]>('/api/achievements/definitions'),
    check: () => apiClient<{ newAchievements: any[]; totalNew: number }>('/api/achievements/check', { method: 'POST' }),
  },
  profile: {
    get: () => apiClient<any>('/api/profile'),
    upsert: (data: any) => apiClient<any>('/api/profile', { method: 'POST', body: data }),
  },
  user: {
    getCurrent: () => apiClient<any>('/api/auth/user'),
    logout: () => apiClient<void>('/api/auth/logout', { method: 'POST' }),
  },
};
