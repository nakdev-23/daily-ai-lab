import { Tabs } from 'expo-router';
import { House, Library, Route, Trophy, User, type LucideIcon } from 'lucide-react-native';
import { colors, fonts } from '../../lib/theme';

function icon(Ic: LucideIcon) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <Ic color={color} size={24} strokeWidth={focused ? 2.6 : 2} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 10, fontFamily: fonts.bodyBold },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'เรียนวันนี้', tabBarIcon: icon(House) }} />
      <Tabs.Screen name="paths" options={{ title: 'เส้นทาง', tabBarIcon: icon(Route) }} />
      <Tabs.Screen name="docs" options={{ title: 'คลังรู้', tabBarIcon: icon(Library) }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'อันดับ', tabBarIcon: icon(Trophy) }} />
      <Tabs.Screen name="profile" options={{ title: 'โปรไฟล์', tabBarIcon: icon(User) }} />
      <Tabs.Screen name="learn" options={{ href: null }} />
    </Tabs>
  );
}
