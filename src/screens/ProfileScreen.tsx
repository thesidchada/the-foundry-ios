import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, clearSession } from '../api/client';
import { THEME } from '../theme';
import type { User, Profile } from '../types';

export default function ProfileScreen() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: loadingUser, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: api.user.getCurrent,
    retry: false,
  });

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: api.profile.get,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: api.user.logout,
    onSuccess: async () => {
      await clearSession();
      queryClient.clear();
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to logout');
    },
  });

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logoutMutation.mutate() },
      ]
    );
  }, [logoutMutation]);

  const initials = useMemo(() => {
    if (!user) return 'U';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  }, [user]);

  const isLoading = loadingUser || loadingProfile;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={THEME.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (userError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile</Text>
          <Text style={styles.errorSubtext}>{userError.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email || 'No email'}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.daysTracked ?? 0}</Text>
            <Text style={styles.statLabel}>Days Tracked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.labTests ?? 0}</Text>
            <Text style={styles.statLabel}>Lab Tests</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.dayStreak ?? 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership</Text>
          <View style={styles.membershipCard}>
            <View style={styles.membershipBadge}>
              <Text style={styles.membershipTier}>{profile?.membershipTier ?? 'FREE'}</Text>
            </View>
            <View style={styles.membershipInfo}>
              <Text style={styles.membershipName}>{profile?.membershipName ?? 'Basic'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>⌚</Text>
            <Text style={styles.settingLabel}>Connected Devices</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingLabel}>Privacy & Security</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>❓</Text>
            <Text style={styles.settingLabel}>Help & Support</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>
            {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>The Foundry v1.0.0</Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 12,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${THEME.primary}20`,
    borderWidth: 2,
    borderColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
  },
  email: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.primary,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.muted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: THEME.border,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  membershipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.primary,
  },
  membershipBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: THEME.primary,
    borderRadius: 6,
    marginRight: 12,
  },
  membershipTier: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  membershipInfo: {
    flex: 1,
  },
  membershipName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: THEME.text,
  },
  settingArrow: {
    fontSize: 20,
    color: THEME.muted,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: `${THEME.error}20`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.error,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.error,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  version: {
    fontSize: 12,
    color: THEME.muted,
  },
});
