// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuthListener } from '../hooks/useAuthListener';
import { AppProvider } from '@/AppProvider';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { BottomNavigation } from '@/components/BottomNavigation';
export default function Layout() {
  const { user } = useAuthListener();

  // Тут можна перевірити, якщо треба:
  // якщо user = null, можливо, перенаправити на /auth, або щось інше.
  // У цьому мінімальному прикладі просто рендеримо Stack.
  // Expo Router автоматично керує шляхами (app/index, app/auth/index, тощо).

  return (
    <NativeBaseProvider theme={theme}>
    <AppProvider>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack   screenOptions={{ 
    headerStyle: { backgroundColor: Colors.primary },
    headerShown: false // Додаємо цей параметр
  }}  />
        <BottomNavigation />
      </View>
    </SafeAreaView>
    </AppProvider>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
});

const theme = extendTheme({
  colors: {
    // Наприклад, свій колір у палітрі "primary"
    primary: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3', // основний
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
  },
});
