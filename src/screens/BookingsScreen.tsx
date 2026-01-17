import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { THEME } from '../theme';
import type { Booking, BookingType } from '../types';

const bookingTypes: { id: BookingType; label: string; icon: string }[] = [
  { id: 'training', label: 'Training', icon: '💪' },
  { id: 'recovery', label: 'Recovery', icon: '❄️' },
  { id: 'biomarker', label: 'Biomarker', icon: '🧬' },
  { id: 'specialist', label: 'Specialist', icon: '👨‍⚕️' },
];

export default function BookingsScreen() {
  const [selectedType, setSelectedType] = useState<BookingType | null>(null);

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: api.bookings.getAll,
  });

  const filteredBookings = useMemo(() => {
    return selectedType
      ? bookings.filter((b: Booking) => b.type === selectedType)
      : bookings;
  }, [bookings, selectedType]);

  const sectionTitle = useMemo(() => {
    if (!selectedType) return 'All Bookings';
    return `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Sessions`;
  }, [selectedType]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load bookings</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Book a Session</Text>
          <Text style={styles.subtitle}>Schedule your next appointment</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typesScroll}
          contentContainerStyle={styles.typesContainer}
        >
          {bookingTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                selectedType === type.id && styles.typeButtonActive
              ]}
              onPress={() => setSelectedType(selectedType === type.id ? null : type.id)}
            >
              <Text style={styles.typeIcon}>{type.icon}</Text>
              <Text style={[
                styles.typeLabel,
                selectedType === type.id && styles.typeLabelActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>

          {isLoading ? (
            <ActivityIndicator color={THEME.primary} size="large" />
          ) : filteredBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No bookings yet</Text>
              <Text style={styles.emptySubtext}>Book a session from the web app</Text>
            </View>
          ) : (
            filteredBookings.map((booking: Booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingTitle}>{booking.title}</Text>
                  <View style={[styles.statusBadge,
                    booking.status === 'confirmed' && styles.statusConfirmed,
                    booking.status === 'pending' && styles.statusPending,
                    booking.status === 'cancelled' && styles.statusCancelled
                  ]}>
                    <Text style={[
                      styles.statusText,
                      booking.status === 'confirmed' && styles.statusTextConfirmed,
                      booking.status === 'cancelled' && styles.statusTextCancelled
                    ]}>{booking.status}</Text>
                  </View>
                </View>
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingDate}>📅 {booking.date}</Text>
                  <Text style={styles.bookingTime}>🕐 {booking.time}</Text>
                </View>
                {booking.notes && (
                  <Text style={styles.bookingNotes}>{booking.notes}</Text>
                )}
              </View>
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
  typesScroll: {
    marginBottom: 20,
  },
  typesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  typeButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    minWidth: 80,
  },
  typeButtonActive: {
    backgroundColor: `${THEME.primary}20`,
    borderColor: THEME.primary,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.muted,
  },
  typeLabelActive: {
    color: THEME.primary,
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
  bookingCard: {
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: THEME.border,
  },
  statusConfirmed: {
    backgroundColor: `${THEME.success}20`,
  },
  statusPending: {
    backgroundColor: `${THEME.warning}20`,
  },
  statusCancelled: {
    backgroundColor: `${THEME.error}20`,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.text,
    textTransform: 'uppercase',
  },
  statusTextConfirmed: {
    color: THEME.success,
  },
  statusTextCancelled: {
    color: THEME.error,
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  bookingDate: {
    fontSize: 13,
    color: THEME.muted,
  },
  bookingTime: {
    fontSize: 13,
    color: THEME.muted,
  },
  bookingNotes: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
