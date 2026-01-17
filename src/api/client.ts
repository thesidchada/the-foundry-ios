import * as SecureStore from 'expo-secure-store';
import type {
  User,
  Protocol,
  Booking,
  HealthMetric,
  Biomarker,
  Achievement,
  AchievementDefinition,
  AchievementProgress,
  CheckAchievementsResponse,
  Profile,
} from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://8ae68bc9-7959-4664-b1e0-87ee0b7abd11-00-yajgfe12b17d.picard.replit.dev';

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
    getByDate: (date: string) => apiClient<Protocol[]>(`/api/protocols/${date}`),
    create: (data: Omit<Protocol, 'id' | 'userId' | 'createdAt'>) =>
      apiClient<Protocol>('/api/protocols', { method: 'POST', body: data }),
    update: (id: number | string, data: Partial<Protocol>) =>
      apiClient<Protocol>(`/api/protocols/${id}`, { method: 'PATCH', body: data }),
    delete: (id: number | string) =>
      apiClient<void>(`/api/protocols/${id}`, { method: 'DELETE' }),
  },
  bookings: {
    getAll: () => apiClient<Booking[]>('/api/bookings'),
    create: (data: Omit<Booking, 'id' | 'userId' | 'createdAt'>) =>
      apiClient<Booking>('/api/bookings', { method: 'POST', body: data }),
    update: (id: number | string, status: string) =>
      apiClient<Booking>(`/api/bookings/${id}`, { method: 'PATCH', body: { status } }),
    delete: (id: number | string) =>
      apiClient<void>(`/api/bookings/${id}`, { method: 'DELETE' }),
  },
  healthMetrics: {
    getRange: (startDate: string, endDate: string) =>
      apiClient<HealthMetric[]>(`/api/metrics?startDate=${startDate}&endDate=${endDate}`),
    getByDate: (date: string) => apiClient<HealthMetric>(`/api/metrics/${date}`),
    getRecent: () => apiClient<HealthMetric[]>('/api/metrics/recent'),
    upsert: (data: Omit<HealthMetric, 'id' | 'userId' | 'createdAt'>) =>
      apiClient<HealthMetric>('/api/metrics', { method: 'POST', body: data }),
  },
  biomarkers: {
    getAll: () => apiClient<Biomarker[]>('/api/biomarkers'),
    create: (data: Omit<Biomarker, 'id' | 'userId' | 'createdAt'>) =>
      apiClient<Biomarker>('/api/biomarkers', { method: 'POST', body: data }),
  },
  achievements: {
    getAll: () => apiClient<Achievement[]>('/api/achievements'),
    getProgress: () => apiClient<AchievementProgress[]>('/api/achievements/progress'),
    getDefinitions: () => apiClient<AchievementDefinition[]>('/api/achievements/definitions'),
    check: () =>
      apiClient<CheckAchievementsResponse>('/api/achievements/check', { method: 'POST' }),
  },
  profile: {
    get: () => apiClient<Profile>('/api/profile'),
    upsert: (data: Partial<Profile>) =>
      apiClient<Profile>('/api/profile', { method: 'POST', body: data }),
  },
  user: {
    getCurrent: () => apiClient<User>('/api/auth/user'),
    logout: () => apiClient<void>('/api/auth/logout', { method: 'POST' }),
  },
};
