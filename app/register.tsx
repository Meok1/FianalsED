import { Link, router } from 'expo-router';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import AppButton from '@/components/AppButton';
import { COLORS } from '@/constants/colors';
import { signUp } from '@/lib/auth';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    const normalizedEmail = email.trim();
    if (!fullName.trim()) return setMessage('Full name is required.');
    if (!normalizedEmail.includes('@')) return setMessage('Enter a valid email address.');
    if (password.length < 6) return setMessage('Password must be at least 6 characters.');
    setBusy(true);
    setMessage(null);
    const { data, error } = await signUp(normalizedEmail, password, fullName.trim(), role);
    setBusy(false);
    if (error) return setMessage(error.message);
    if (!data.session) return setMessage('Account created. Check your email to confirm, then sign in.');
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandMark}>
          <Ionicons name="sparkles-outline" size={30} color={COLORS.textOnPrimary} />
        </View>
        <Text style={styles.eyebrow}>JOIN QR ATTENDANCE</Text>
        <Text style={styles.title}>Create account</Text>
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Full name</Text>
          <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={COLORS.textTertiary} value={fullName} onChangeText={setFullName} />
          <Text style={styles.fieldLabel}>Email address</Text>
          <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={COLORS.textTertiary} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput style={styles.input} placeholder="At least 6 characters" placeholderTextColor={COLORS.textTertiary} secureTextEntry value={password} onChangeText={setPassword} />
          <Text style={styles.label}>I am signing up as</Text>
          <View style={styles.roleRow}>
            {(['student', 'teacher'] as const).map((option) => (
              <Pressable key={option} style={[styles.role, role === option && styles.roleSelected]} onPress={() => setRole(option)}>
                <Ionicons name={option === 'student' ? 'person-outline' : 'school-outline'} size={19} color={role === option ? COLORS.textOnPrimary : COLORS.primary} />
                <Text style={[styles.roleText, role === option && styles.roleTextSelected]}>{option[0].toUpperCase() + option.slice(1)}</Text>
              </Pressable>
            ))}
          </View>
          {message && <Text style={styles.message}>{message}</Text>}
          <AppButton theme="primary" title={busy ? 'Creating...' : 'Create account'} icon="person-add-outline" onPress={handleRegister} disabled={busy} />
        </View>
        <Link href="/login" style={styles.link}>Already have an account?</Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' },
  content: { padding: 24, width: '100%', maxWidth: 520, alignSelf: 'center' },
  brandMark: { width: 62, height: 62, borderRadius: 20, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 18, shadowColor: COLORS.shadow, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
  eyebrow: { color: COLORS.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1.8, marginBottom: 8 },
  title: { color: COLORS.textPrimary, fontSize: 32, fontWeight: '800', marginBottom: 22 },
  formCard: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth: 1, borderRadius: 22, padding: 18, shadowColor: COLORS.shadow, shadowOpacity: 0.08, shadowRadius: 18, elevation: 3 },
  fieldLabel: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 7 },
  input: { backgroundColor: COLORS.surfaceLight, borderColor: COLORS.border, borderWidth: 1, borderRadius: 13, color: COLORS.textPrimary, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 15 },
  label: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700', marginTop: 2, marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  role: { flex: 1, minHeight: 54, borderColor: COLORS.border, borderWidth: 1, borderRadius: 13, padding: 10, alignItems: 'center', justifyContent: 'center', gap: 4 },
  roleSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  roleText: { color: COLORS.textPrimary, fontWeight: '700' },
  roleTextSelected: { color: COLORS.textOnPrimary },
  message: { color: '#B3265E', marginBottom: 12 },
  link: { color: COLORS.primary, fontWeight: '700', textAlign: 'center', marginTop: 18 },
});