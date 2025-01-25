// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuthListener } from '../hooks/useAuthListener';
import { AppProvider } from '@/AppProvider';

export default function Layout() {
  const { user } = useAuthListener();

  // Тут можна перевірити, якщо треба:
  // якщо user = null, можливо, перенаправити на /auth, або щось інше.
  // У цьому мінімальному прикладі просто рендеримо Stack.
  // Expo Router автоматично керує шляхами (app/index, app/auth/index, тощо).

  return (
    <AppProvider>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack screenOptions={{ headerStyle: { backgroundColor: Colors.primary }}} />
      </View>
    </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
});
