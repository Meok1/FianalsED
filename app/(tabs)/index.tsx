import { router } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/AppButton';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';

export default function Index() {
  const { profile, role } = useAuth();

  useEffect(() => {
    if (role === 'administrator') router.replace('/admin');
  }, [role]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Header title="QR Attendance" />
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.mainTitle}>School Event Attendance</Text>
          <Text style={styles.subtitle}>
            Scan QR Codes to record attendance during school activities.
          </Text>
        </View>

        <View style={styles.footerContainer}>
          <AppButton
            theme="primary"
            title="Scan QR Code"
            icon="qr-code-outline"
            onPress={() => router.push('/scan')}
          />
          <AppButton
            title="Attendance History"
            icon="time-outline"
            onPress={() => router.push('/history')}
          />
          <AppButton
            title="Profile"
            icon="person-outline"
            onPress={() => router.push('/profile')}
          />
          {(profile?.role === 'teacher' || profile?.role === 'administrator') && (
            <AppButton
              theme="primary"
              title="Create Event QR"
              icon="school-outline"
              onPress={() => router.push('/teacher')}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingVertical: 24 },
  headerContainer: { justifyContent: 'center' },
  bodyContainer: { alignItems: 'center', paddingHorizontal: 32, marginBottom: 16 },
  mainTitle: { fontSize: 18, fontWeight: '600', color: COLORS.primary, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  footerContainer: { alignItems: 'center', paddingHorizontal: 24, width: '100%' },
});
