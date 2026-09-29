import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { colors, fonts } from '../theme';
import AppText from '../components/AppText';
import AppIcon from '../components/AppIcon';

export default function SplashScreen({ navigation }) {
  const { user, authLoading } = useApp();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.4)),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Subtle breathing pulse for the emblem
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // Loading dots animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(dotsAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
    ).start();
  }, [dotsAnim, fadeAnim, pulseAnim, scaleAnim, slideAnim]);

  useEffect(() => {
    if (authLoading) return undefined;
    const timer = setTimeout(() => {
      navigation.replace(user ? 'MainApp' : 'Login');
    }, 1200);
    return () => clearTimeout(timer);
  }, [authLoading, navigation, user]);

  return (
    <LinearGradient
      colors={['#062316', '#0f3b28', '#174f36', '#1e6344']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.page}
    >
      <StatusBar style="light" />

      {/* Decorative ambient background rings */}
      <View style={styles.ambientRingOuter} />
      <View style={styles.ambientRingInner} />

      {/* Main Brand Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Glowing Emblem */}
        <Animated.View style={[styles.emblemWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.22)', 'rgba(38,132,91,0.4)']}
            style={styles.emblemOuter}
          >
            <View style={styles.emblemInner}>
              <View style={styles.iconCircle}>
                <AppIcon name="compass" size={32} color={colors.mint} />
              </View>
              <AppText style={styles.markText}>STP</AppText>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Brand Name with clean non-colliding typography */}
        <View style={styles.textContainer}>
          <AppText style={styles.titlePrimary}>Smart Travel</AppText>
          <AppText style={styles.titleSecondary}>Planner</AppText>
        </View>

        {/* Decorative Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </View>

        {/* Tagline */}
        <AppText style={styles.tagline}>
          PAKISTAN, PLANNED AROUND YOU
        </AppText>

        {/* Feature Pills */}
        <View style={styles.featuresRow}>
          <View style={styles.featureBadge}>
            <AppIcon name="sparkles" size={13} color={colors.mint} />
            <AppText style={styles.featureText}>AI Itineraries</AppText>
          </View>
          <View style={styles.featureBadge}>
            <AppIcon name="map-outline" size={13} color={colors.mint} />
            <AppText style={styles.featureText}>Offline Ready</AppText>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Loading Indicator */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dotsAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
                transform: [{
                  scale: dotsAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.8, 1.2, 0.8],
                  }),
                }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dotsAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.6, 0.3, 1],
                }),
                transform: [{
                  scale: dotsAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.8, 1.2],
                  }),
                }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dotsAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.6, 0.3],
                }),
                transform: [{
                  scale: dotsAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1.2, 1, 0.8],
                  }),
                }],
              },
            ]}
          />
        </View>
        <AppText style={styles.versionText}>Your Smart Journey Companion</AppText>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ambientRingOuter: {
    position: 'absolute',
    width: 440,
    height: 440,
    borderRadius: 220,
    borderWidth: 1,
    borderColor: 'rgba(223, 243, 232, 0.07)',
    top: '18%',
  },
  ambientRingInner: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(223, 243, 232, 0.12)',
    top: '24%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  emblemWrapper: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  emblemOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemInner: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#0c2e1f',
    borderWidth: 1.5,
    borderColor: 'rgba(223, 243, 232, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconCircle: {
    marginBottom: 2,
  },
  markText: {
    color: '#ffffff',
    fontFamily: fonts.extraBold,
    fontSize: 13,
    letterSpacing: 2.5,
    marginTop: 1,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titlePrimary: {
    color: '#ffffff',
    fontSize: 34,
    lineHeight: 42,
    fontFamily: fonts.displayBold,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleSecondary: {
    color: '#dff3e8',
    fontSize: 34,
    lineHeight: 42,
    fontFamily: fonts.display,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(223, 243, 232, 0.3)',
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint,
    marginHorizontal: 8,
  },
  tagline: {
    color: '#bfe2cf',
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 2.8,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(223, 243, 232, 0.2)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureText: {
    color: '#dff3e8',
    fontSize: 11,
    fontFamily: fonts.semibold,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 48 : 36,
    alignItems: 'center',
    gap: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint,
  },
  versionText: {
    color: 'rgba(223, 243, 232, 0.65)',
    fontSize: 11,
    fontFamily: fonts.medium,
    letterSpacing: 0.5,
  },
});
