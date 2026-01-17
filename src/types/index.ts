// User types
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

// Protocol types
export interface Protocol {
  id: number;
  userId: number;
  title: string;
  date: string;
  time?: string;
  completed: boolean;
  createdAt: string;
}

// Booking types
export type BookingType = 'training' | 'recovery' | 'biomarker' | 'specialist';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Booking {
  id: number;
  userId: number;
  title: string;
  type: BookingType;
  date: string;
  time: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

// Health metrics types
export type MetricType = 'sleep' | 'recovery' | 'rhr' | 'hrv' | 'steps' | 'calories';

export interface HealthMetric {
  id: number;
  userId: number;
  type: MetricType;
  value: number;
  date: string;
  createdAt: string;
}

// Biomarker types
export interface Biomarker {
  id: number;
  userId: number;
  name: string;
  value: number;
  unit: string;
  date: string;
  createdAt: string;
}

// Achievement types
export interface AchievementDefinition {
  key: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
}

export interface AchievementProgress {
  key: string;
  current: number;
  threshold: number;
}

export interface Achievement {
  id: number;
  userId: number;
  achievementKey: string;
  unlockedAt: string;
}

export interface CheckAchievementsResponse {
  newAchievements: Achievement[];
  totalNew: number;
}

// Profile types
export interface Profile {
  id: number;
  userId: number;
  membershipTier?: string;
  membershipName?: string;
  daysTracked: number;
  labTests: number;
  dayStreak: number;
  updatedAt: string;
}
