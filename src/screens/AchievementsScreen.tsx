import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/client';

const THEME = {
  primary: '#c45c26',
  background: '#0a0a0a',
  card: '#18181b',
  border: '#27272a',
  text: '#fafafa',
  muted: '#71717a',
  success: '#22c55e',
};

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  CheckCircle: 'checkmark-circle',
  Trophy: 'trophy',
  Calendar: 'calendar',
  Star: 'star',
  Moon: 'moon',
  Heart: 'heart',
  Footprints: 'footsteps',
  Flame: 'flame',
};

export default function AchievementsScreen() {
  const queryClient = useQueryClient();

  const { data: definitions = [], isLoading: loadingDefs } = useQuery({
    queryKey: ['achievements', 'definitions'],
    queryFn: () => api.achievements.getDefinitions(),
  });

  const { data: progress = [], isLoading: loadingProgress } = useQuery({
    queryKey: ['achievements', 'progress'],
    queryFn: () => api.achievements.getProgress(),
  });

  const { data: unlocked = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.achievements.getAll(),
  });

  const checkMutation = useMutation({
    mutationFn: () => api.achievements.check(),
    onSuccess: (data) => {
      if (data.totalNew > 0) {
        queryClient.invalidateQueries({ queryKey: ['achievements'] });
        queryClient.invalidateQueries({ queryKey: ['achievements', 'progress'] });
      }
    },
  });

  const isLoading = loadingDefs || loadingProgress;
  const progressMap = new Map(progress.map((p: any) => [p.key, p]));
  const unlockedKeys = new Set(unlocked.map((a: any) => a.achievementKey));

  const unlockedCount = unlocked.length;
  const totalCount = definitions.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>{unlockedCount} of {totalCount} unlocked</Text>
        </View>

        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => checkMutation.mutate()}
          disabled={checkMutation.isPending}
        >
          <Ionicons name="refresh" size={18} color={THEME.text} />
          <Text style={styles.checkButtonText}>
            {checkMutation.isPending ? 'Checking...' : 'Check Progress'}
          </Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator color={THEME.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.grid}>
            {definitions.map((def: any) => {
              const prog = progressMap.get(def.key);
              const isUnlocked = unlockedKeys.has(def.key);
              const iconName = iconMap[def.icon] || 'ribbon';
              const progressPercent = prog ? Math.min((prog.current / prog.threshold) * 100, 100) : 0;

              return (
                <View
                  key={def.key}
                  style={[
                    styles.achievementCard,
                    isUnlocked && styles.achievementCardUnlocked,
                  ]}
                >
                  <View style={[styles.iconContainer, isUnlocked && styles.iconContainerUnlocked]}>
                    {isUnlocked ? (
                      <Ionicons name={iconName} size={28} color={THEME.primary} />
                    ) : (
                      <Ionicons name="lock-closed" size={24} color={THEME.muted} />
                    )}
                  </View>
                  
                  <Text style={[styles.achievementTitle, !isUnlocked && styles.locked]}>
                    {def.title}
                  </Text>
                  <Text style={styles.achievementDesc}>{def.description}</Text>

                  {!isUnlocked && prog && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{prog.current}/{prog.threshold}</Text>
                    </View>
                  )}

                  {isUnlocked && (
                    <View style={styles.unlockedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={THEME.success} />
                      <Text style={styles.unlockedText}>Unlocked</Text>
                    </View>
                  )}
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
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    backgroundColor: THEME.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  checkButtonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  grid: {
    padding: 20,
    paddingTop: 0,
  },
  achievementCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  achievementCardUnlocked: {
    borderColor: THEME.primary + '40',
    backgroundColor: THEME.primary + '10',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconContainerUnlocked: {
    backgroundColor: THEME.primary + '20',
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  locked: {
    color: THEME.muted,
  },
  achievementDesc: {
    fontSize: 12,
    color: THEME.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: THEME.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: THEME.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  unlockedText: {
    fontSize: 12,
    color: THEME.success,
    fontWeight: '500',
    marginLeft: 4,
  },
});
