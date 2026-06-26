import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import {
  Anuphan_400Regular,
  Anuphan_500Medium,
  Anuphan_600SemiBold,
  Anuphan_700Bold,
} from '@expo-google-fonts/anuphan';
import { AuthProvider, useAuth } from '../lib/auth';
import { Loading } from '../components/ui';
import { colors, fonts } from '../lib/theme';

// Finishes any pending OAuth session when the in-app browser redirects back.
WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  if (loading) return <Loading label="กำลังโหลด..." />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgElevated },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 18, color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="course/[slug]" options={{ title: 'คอร์ส' }} />
      <Stack.Screen name="lesson/[slug]/[num]" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="daily-learn/index" options={{ title: 'เรียนรายวัน' }} />
      <Stack.Screen name="daily-learn/[topic]" options={{ title: 'หัวข้อ' }} />
      <Stack.Screen name="docs/[tool]" options={{ title: 'คู่มือ' }} />
      <Stack.Screen name="paths/[id]" options={{ title: 'เส้นทาง' }} />
      <Stack.Screen name="paths-learn/[id]/[step]" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="settings" options={{ title: 'ตั้งค่า' }} />
      <Stack.Screen name="upgrade" options={{ title: 'อัปเกรด Pro', presentation: 'modal' }} />
      <Stack.Screen name="missions" options={{ title: 'ภารกิจ' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Anuphan_400Regular,
    Anuphan_500Medium,
    Anuphan_600SemiBold,
    Anuphan_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
