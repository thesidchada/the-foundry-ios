import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';

const { width, height } = Dimensions.get('window');

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.featureCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon} size={24} color={THEME.primary} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
}

interface StatBadgeProps {
  value: string;
  label: string;
}

function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function LandingScreen() {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoScale, logoOpacity, heroOpacity]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Decorative Background Elements */}
          <View style={styles.bgCircle1} />
          <View style={styles.bgCircle2} />
          <View style={styles.bgCircle3} />

          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoInner}>
              <Ionicons name="fitness" size={48} color={THEME.primary} />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View style={{ opacity: heroOpacity }}>
            <Text style={styles.brandName}>The Foundry</Text>
            <Text style={styles.tagline}>Forge Your Best Self</Text>
          </Animated.View>

          {/* Stats Row */}
          <Animated.View style={[styles.statsRow, { opacity: heroOpacity }]}>
            <StatBadge value="10K+" label="Members" />
            <View style={styles.statDivider} />
            <StatBadge value="50+" label="Protocols" />
            <View style={styles.statDivider} />
            <StatBadge value="4.9" label="Rating" />
          </Animated.View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Everything You Need</Text>

          <FeatureCard
            icon="calendar-outline"
            title="Daily Protocols"
            description="Track your personalized health routines with smart reminders"
            delay={200}
          />

          <FeatureCard
            icon="pulse-outline"
            title="Health Metrics"
            description="Monitor sleep, HRV, steps, and recovery in one place"
            delay={350}
          />

          <FeatureCard
            icon="trophy-outline"
            title="Achievements"
            description="Unlock milestones and celebrate your progress"
            delay={500}
          />

          <FeatureCard
            icon="people-outline"
            title="Expert Sessions"
            description="Book trainers, specialists, and recovery sessions"
            delay={650}
          />
        </View>

        {/* Testimonial */}
        <View style={styles.testimonialSection}>
          <View style={styles.quoteIcon}>
            <Ionicons name="chatbubble-ellipses" size={20} color={THEME.primary} />
          </View>
          <Text style={styles.testimonialText}>
            "The Foundry completely transformed my approach to health. The daily protocols keep me accountable."
          </Text>
          <View style={styles.testimonialAuthor}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitials}>AK</Text>
            </View>
            <View>
              <Text style={styles.authorName}>Arjun K.</Text>
              <Text style={styles.authorTitle}>Member since 2024</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
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
  scrollContent: {
    flexGrow: 1,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: `${THEME.primary}08`,
    top: -100,
    right: -100,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${THEME.primary}06`,
    top: 50,
    left: -80,
  },
  bgCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: `${THEME.primary}04`,
    bottom: 0,
    right: -30,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoInner: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: `${THEME.primary}15`,
    borderWidth: 2,
    borderColor: `${THEME.primary}40`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 36,
    fontWeight: '800',
    color: THEME.text,
    textAlign: 'center',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: THEME.muted,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: THEME.card,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  statBadge: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.primary,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: THEME.border,
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.card,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${THEME.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: THEME.muted,
    lineHeight: 18,
  },

  // Testimonial Section
  testimonialSection: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 20,
    backgroundColor: `${THEME.primary}08`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${THEME.primary}20`,
  },
  quoteIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${THEME.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  testimonialText: {
    fontSize: 15,
    color: THEME.text,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
  },
  authorTitle: {
    fontSize: 12,
    color: THEME.muted,
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    paddingVertical: 18,
    borderRadius: 14,
    gap: 8,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.primary,
  },
  termsText: {
    fontSize: 12,
    color: THEME.muted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: THEME.primary,
    fontWeight: '500',
  },
});
