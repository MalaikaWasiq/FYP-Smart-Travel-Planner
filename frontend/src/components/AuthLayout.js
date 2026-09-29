import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radius } from '../theme';
import AppText from './AppText';
import AppIcon from './AppIcon';

export function AuthLayout({ title, subtitle, serverError, children }) {
  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <StatusBar style="light" />
      <LinearGradient colors={[colors.forest, '#1b5c40', colors.green]} style={styles.hero}>
        <View style={styles.markBadge}>
          <View style={styles.markInner}>
            <AppIcon name="compass" size={20} color={colors.mint} />
            <AppText variant="label" color={colors.white} style={styles.markText}>STP</AppText>
          </View>
        </View>
        <AppText variant="title" color={colors.white} style={styles.heroTitle}>Smart Travel Planner</AppText>
        <AppText color={colors.mint} style={styles.heroSubtitle}>{subtitle}</AppText>
      </LinearGradient>

      <View style={styles.card}>
        <AppText variant="title" style={styles.title}>{title}</AppText>

        {serverError ? (
          <View style={authStyles.errorBanner}>
            <AppIcon name="alert-circle" size={18} color={colors.red} />
            <AppText style={authStyles.errorBannerText}>{serverError}</AppText>
          </View>
        ) : null}

        {children}
      </View>
    </ScrollView>
  );
}

export function FormField({ label, error, isPassword, secureTextEntry, rightAction, ...inputProps }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isSecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={styles.fieldWrap}>
      <View style={styles.labelRow}>
        <AppText variant="label" style={styles.label}>{label}</AppText>
        {rightAction}
      </View>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error && styles.inputError,
      ]}>
        <TextInput
          {...inputProps}
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
          placeholderTextColor="#9aa69f"
          style={styles.input}
        />
        {isPassword ? (
          <Pressable
            hitSlop={10}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <AppIcon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.muted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <AppIcon name="alert-circle-outline" size={14} color={colors.red} />
          <AppText variant="caption" color={colors.red} style={styles.errorText}>{error}</AppText>
        </View>
      ) : null}
    </View>
  );
}

export const authStyles = StyleSheet.create({
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  switchText: { color: colors.muted, fontSize: 14 },
  switchLink: { color: colors.forest, fontWeight: '700', fontSize: 14 },
  banner: {
    backgroundColor: colors.mint,
    borderColor: '#afd6c0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  bannerTitle: { color: colors.forest, fontWeight: '700' },
  bannerText: { color: colors.ink, marginTop: 3, lineHeight: 19 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f2',
    borderColor: '#f8b4b4',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: { color: colors.red, flex: 1, fontSize: 13, lineHeight: 18 },
});

const styles = StyleSheet.create({
  page: { flexGrow: 1, backgroundColor: colors.cream },
  hero: { paddingTop: 64, paddingBottom: 42, alignItems: 'center' },
  markBadge: {
    padding: 3,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  markInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(15, 51, 35, 0.5)',
  },
  markText: { letterSpacing: 1.5, fontSize: 13 },
  heroTitle: { marginTop: 14, textAlign: 'center' },
  heroSubtitle: { marginTop: 5, textAlign: 'center' },
  card: {
    flex: 1,
    backgroundColor: colors.paper,
    marginTop: -18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 26,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  title: { marginBottom: 12 },
  fieldWrap: { marginTop: 14 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { color: colors.ink },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8f5',
    borderColor: colors.line,
    borderWidth: 1.2,
    borderRadius: radius.md,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: colors.forest,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: colors.red,
    backgroundColor: '#fff8f7',
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 14,
    paddingVertical: 10,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 6,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  errorText: {
    marginLeft: 2,
    fontSize: 12,
  },
});
