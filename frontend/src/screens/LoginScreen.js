import React, { useRef, useState } from 'react';
import { Pressable as TouchableOpacity, View } from 'react-native';
import { AuthLayout, FormField, authStyles } from '../components/AuthLayout';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import Text from '../components/AppText';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginScreen({ navigation, route }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);

  function updateEmail(value) {
    setEmail(value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    if (serverError) setServerError('');
  }

  function updatePassword(value) {
    setPassword(value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    if (serverError) setServerError('');
  }

  function validate() {
    const newErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email address (e.g. name@example.com)';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function submit() {
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigation.replace('MainApp');
    } catch (requestError) {
      const msg = requestError.message || 'Unable to sign in. Please check your connection.';
      if (
        msg.toLowerCase().includes('incorrect') ||
        msg.toLowerCase().includes('unauthorized') ||
        msg.toLowerCase().includes('401')
      ) {
        setServerError('Incorrect email or password. Please try again.');
      } else {
        setServerError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Continue planning your next journey"
      serverError={serverError}
    >
      {route?.params?.successMessage ? (
        <View style={authStyles.banner}>
          <Text style={authStyles.bannerTitle}>Account ready</Text>
          <Text style={authStyles.bannerText}>{route.params.successMessage}</Text>
        </View>
      ) : null}

      <FormField
        label="Email"
        value={email}
        onChangeText={updateEmail}
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
        value={password}
        onChangeText={updatePassword}
        isPassword
        placeholder="Enter your password"
        returnKeyType="done"
        onSubmitEditing={submit}
        error={errors.password}
      />
      <PrimaryButton title="SIGN IN" onPress={submit} loading={loading} />
      <View style={authStyles.switchRow}>
        <Text style={authStyles.switchText}>New here? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={authStyles.switchLink}>Create account</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
