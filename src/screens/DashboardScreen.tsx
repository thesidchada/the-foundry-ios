import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { THEME } from '../theme';
import type { Protocol } from '../types';

export default function DashboardScreen() {
  const queryClient = useQueryClient();
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const { data: protocols = [], isLoading, error } = useQuery({
    queryKey: ['protocols', today],
    queryFn: () => api.protocols.getByDate(today),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      api.protocols.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
    },
  });

  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const completed = protocols.filter((p: Protocol) => p.completed).length;
    const total = protocols.length;
    return {
      completedCount: completed,
      totalCount: total,
      progressPercent: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [protocols]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load protocols</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>The Foundry</Text>
          <Text style={styles.subtitle}>Your Daily Protocol</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressCount}>{completedCount}/{totalCount}</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Protocol Items</Text>

          {isLoading ? (
            <ActivityIndicator color={THEME.primary} size="large" />
          ) : protocols.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No protocols for today</Text>
              <Text style={styles.emptySubtext}>Add items to track your daily routine</Text>
            </View>
          ) : (
            protocols.map((item: Protocol) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.protocolItem, item.completed && styles.protocolItemCompleted]}
                onPress={() => toggleMutation.mutate({ id: item.id, completed: !item.completed })}
              >
                <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                  {item.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.protocolContent}>
                  <Text style={[styles.protocolTitle, item.completed && styles.protocolTitleCompleted]}>
                    {item.title}
                  </Text>
                  {item.time && (
                    <Text style={styles.protocolTime}>{item.time}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
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
  progressCard: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: THEME.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.primary,
    borderRadius: 4,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: THEME.muted,
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
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 8,
  },
  protocolItemCompleted: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  protocolContent: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME.text,
  },
  protocolTitleCompleted: {
    textDecorationLine: 'line-through',
    color: THEME.muted,
  },
  protocolTime: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 2,
  },
});
