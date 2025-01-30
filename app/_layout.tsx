import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuthListener } from '../hooks/useAuthListener';
import { AppProvider } from '@/AppProvider';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function Layout() {
  const { user } = useAuthListener();

  return (
    <NativeBaseProvider theme={theme}>
      <AppProvider>
        <SafeAreaView style={styles.safeArea}>
          {/* Блок з логотипом */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Основний вміст */}
          <View style={styles.contentContainer}>
            <Stack
              screenOptions={{
                headerShown: false, // Вимкнути стандартний заголовок
                contentStyle: { backgroundColor: Colors.background },
              }}
            />
            <BottomNavigation />
          </View>
        </SafeAreaView>
      </AppProvider>
    </NativeBaseProvider>
  );
}

// Стилі
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: 'absolute', // Абсолютне позиціювання
    top: 0,               // Притискаємо до верху
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,            // Щоб блок був над контентом
    // Тінь
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  logoContainer: {
    height: 80, // Висота блоку з лого
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logo: {
    width: 300, // Ширина логотипу
    height: 50, // Висота логотипу
  },
  contentContainer: {
    flex: 1,
    
    marginTop: 80, // Відступ для накладання
    zIndex: 0, 

  },
});

// Тема для NativeBase
const theme = extendTheme({
  colors: {
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
  components: {
    Button: {
      variants: {
        solid: {
          bg: Colors.primary,
        },
      },
    },
  },
});