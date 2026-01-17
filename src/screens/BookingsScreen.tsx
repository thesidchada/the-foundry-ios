import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

const THEME = {
  primary: '#c45c26',
  background: '#0a0a0a',
  card: '#18181b',
  border: '#27272a',
  text: '#fafafa',
  muted: '#71717a',
};

const bookingTypes = [
  { id: 'training', label: 'Training', icon: '💪' },
  { id: 'recovery', label: 'Recovery', icon: '❄️' },
  { id: 'biomarker', label: 'Biomarker', icon: '🧬' },
  { id: 'specialist', label: 'Specialist', icon: '👨‍⚕️' },
];

export default function BookingsScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: api.bookings.getAll,
  });

  const filteredBookings = selectedType 
    ? bookings.filter((b: any) => b.type === selectedType)
    : bookings;

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
          <Text style={styles.sectionTitle}>
            {selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Sessions` : 'All Bookings'}
          </Text>
          
          {isLoading ? (
            <ActivityIndicator color={THEME.primary} size="large" />
          ) : filteredBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No bookings yet</Text>
              <Text style={styles.emptySubtext}>Book a session from the web app</Text>
            </View>
          ) : (
            filteredBookings.map((booking: any) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingTitle}>{booking.title}</Text>
                  <View style={[styles.statusBadge, 
                    booking.status === 'confirmed' && styles.statusConfirmed,
                    booking.status === 'pending' && styles.statusPending
                  ]}>
                    <Text style={styles.statusText}>{booking.status}</Text>
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
    backgroundColor: '#10b98120',
  },
  statusPending: {
    backgroundColor: '#f59e0b20',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.text,
    textTransform: 'uppercase',
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
