export const THEME = {
  primary: '#c45c26',
  background: '#0a0a0a',
  card: '#18181b',
  border: '#27272a',
  text: '#fafafa',
  muted: '#71717a',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
} as const;

export type ThemeColors = typeof THEME;
