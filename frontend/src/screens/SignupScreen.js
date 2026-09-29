import React, { useRef, useState } from 'react';
import { Pressable as TouchableOpacity, View } from 'react-native';
import { AuthLayout, FormField, authStyles } from '../components/AuthLayout';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import Text from '../components/AppText';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s.'-]+$/;

export default function SignupScreen({ navigation }) {
  const { signup } = useApp();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const update = (key) => (value) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  function validate() {
    const newErrors = {};
    const trimmedName = form.fullName.trim();
    const trimmedEmail = form.email.trim();

    // Full Name
    if (!trimmedName) {
      newErrors.fullName = 'Full name is required';
    } else if (trimmedName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    } else if (trimmedName.length > 80) {
      newErrors.fullName = 'Name cannot exceed 80 characters';
    } else if (!NAME_REGEX.test(trimmedName)) {
      newErrors.fullName = 'Name should only contain letters and spaces';
    }

    // Email
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email address (e.g. name@example.com)';
    }

    // Password
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (form.password.length > 128) {
      newErrors.password = 'Password is too long (max 128 characters)';
    }

    // Confirm Password
    if (!form.confirm) {
      newErrors.confirm = 'Please repeat your password';
    } else if (form.password !== form.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function submit() {
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(form.fullName.trim(), form.email.trim().toLowerCase(), form.password);
      navigation.replace('Login', {
        successMessage: 'Your account is ready. Sign in with your email and password.',
      });
    } catch (requestError) {
      const msg = requestError.message || 'Unable to create account. Please try again.';
      if (msg.toLowerCase().includes('already registered')) {
        setErrors((prev) => ({ ...prev, email: 'This email is already registered. Please sign in.' }));
      } else {
        setServerError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Build and save personalized journeys"
      serverError={serverError}
    >
      <FormField
        label="Full name"
        value={form.fullName}
        onChangeText={update('fullName')}
        placeholder="e.g. Malaika"
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        error={errors.fullName}
      />
      <FormField
        ref={emailRef}
        label="Email"
        value={form.email}
        onChangeText={update('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        placeholder="name@example.com"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        error={errors.email}
      />
      <FormField
        ref={passwordRef}
        label="Password"
        value={form.password}
        onChangeText={update('password')}
        isPassword
        placeholder="At least 6 characters"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
        error={errors.password}
      />
      <FormField
        ref={confirmRef}
        label="Confirm password"
        value={form.confirm}
        onChangeText={update('confirm')}
        isPassword
        placeholder="Repeat your password"
        returnKeyType="done"
        onSubmitEditing={submit}
        error={errors.confirm}
      />
      <PrimaryButton title="CREATE ACCOUNT" onPress={submit} loading={loading} />
      <View style={authStyles.switchRow}>
        <Text style={authStyles.switchText}>Already registered? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={authStyles.switchLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
