import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import AppButton from '@/components/AppButton';
import { useAuth } from '@/components/AuthProvider';
import { COLORS } from '@/constants/colors';
import { signOut } from '@/lib/auth';
import { updateProfile } from '@/lib/profiles';

export default function ProfileScreen() {
  const { profile, session, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile?.full_name]);

  const saveProfile = async () => {
    if (!profile || !fullName.trim()) return;
    try {
      await updateProfile(profile.id, fullName);
      await refreshProfile();
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update profile.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>ACCOUNT</Text>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.role}>
          {profile?.role === 'administrator' ? 'Administrator' : profile?.role === 'teacher' ? 'Teacher' : 'Student'}
        </Text>
        <Text style={styles.detail}>{session?.user.email}</Text>
        <Text style={styles.detail}>User ID: {session?.user.id}</Text>
        <Text style={styles.label}>Full name</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        {message && <Text style={styles.message}>{message}</Text>}
        <AppButton theme="primary" title="Save profile" icon="save-outline" onPress={saveProfile} />
        <AppButton title="Sign out" icon="log-out-outline" onPress={signOut} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
  },
  content: { padding: 24 },
  eyebrow: { color: COLORS.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: COLORS.textPrimary, fontSize: 28, fontWeight: '700', marginBottom: 4 },
  role: { color: COLORS.textSecondary, fontSize: 15, marginBottom: 28 },
  detail: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 6 },
  label: { color: COLORS.textPrimary, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth: 1, borderRadius: 12, color: COLORS.textPrimary, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 12 },
  message: { color: COLORS.primary, marginBottom: 12 },
});