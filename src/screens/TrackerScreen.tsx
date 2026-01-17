import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { THEME } from '../theme';
import type { HealthMetric, MetricType } from '../types';

const metricConfigs: Record<MetricType, { icon: string; color: string; unit: string }> = {
  sleep: { icon: '🌙', color: '#8b5cf6', unit: 'hours' },
  recovery: { icon: '💚', color: THEME.success, unit: '%' },
  rhr: { icon: '❤️', color: THEME.error, unit: 'bpm' },
  hrv: { icon: '📈', color: '#3b82f6', unit: 'ms' },
  steps: { icon: '👟', color: '#0ea5e9', unit: 'steps' },
  calories: { icon: '🔥', color: THEME.warning, unit: 'kcal' },
};

const defaultConfig = { icon: '📊', color: THEME.primary, unit: '' };

export default function TrackerScreen() {
  const { data: metrics = [], isLoading, error } = useQuery({
    queryKey: ['healthMetrics'],
    queryFn: api.healthMetrics.getRecent,
  });

  const latestMetrics = useMemo(() => {
    return metrics.reduce((acc: Record<string, HealthMetric>, m: HealthMetric) => {
      if (!acc[m.type] || new Date(m.date) > new Date(acc[m.type].date)) {
        acc[m.type] = m;
      }
      return acc;
    }, {});
  }, [metrics]);

  const recentActivity = useMemo(() => metrics.slice(0, 10), [metrics]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load metrics</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Tracker</Text>
          <Text style={styles.subtitle}>Your vitals at a glance</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={THEME.primary} size="large" />
          </View>
        ) : Object.keys(latestMetrics).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>No metrics recorded</Text>
            <Text style={styles.emptySubtext}>Connect your wearable to sync data</Text>
          </View>
        ) : (
          <View style={styles.metricsGrid}>
            {Object.entries(latestMetrics).map(([type, metric]) => {
              const config = metricConfigs[type as MetricType] || defaultConfig;
              return (
                <View key={type} style={styles.metricCard}>
                  <View style={[styles.metricIcon, { backgroundColor: `${config.color}20` }]}>
                    <Text style={styles.metricEmoji}>{config.icon}</Text>
                  </View>
                  <Text style={styles.metricLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  <Text style={[styles.metricValue, { color: config.color }]}>
                    {metric.value}
                  </Text>
                  <Text style={styles.metricUnit}>{config.unit}</Text>
                </View>
              );
            })}
          </View>
        )}

        {recentActivity.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            {recentActivity.map((metric: HealthMetric, index: number) => {
              const config = metricConfigs[metric.type] || defaultConfig;
              return (
                <View key={`${metric.id}-${index}`} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: `${config.color}20` }]}>
                    <Text>{config.icon}</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {metric.type.charAt(0).toUpperCase() + metric.type.slice(1)}
                    </Text>
                    <Text style={styles.activityDate}>{metric.date}</Text>
                  </View>
                  <Text style={[styles.activityValue, { color: config.color }]}>
                    {metric.value} {config.unit}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.text,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.error,
  },
  errorSubtext: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  metricCard: {
    width: '47%',
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricEmoji: {
    fontSize: 24,
  },
  metricLabel: {
    fontSize: 12,
    color: THEME.muted,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  metricUnit: {
    fontSize: 11,
    color: THEME.muted,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: THEME.card,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text,
  },
  activityDate: {
    fontSize: 11,
    color: THEME.muted,
  },
  activityValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
