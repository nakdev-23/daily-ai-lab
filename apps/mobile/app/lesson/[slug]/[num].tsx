import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../lib/auth';
import { completeLesson } from '../../../lib/data';
import { loadBundledLesson } from '../../../lib/lesson-content';
import { LessonRunner } from '../../../components/lesson-runner';
import { Button } from '../../../components/ui';
import { colors, font, spacing } from '../../../lib/theme';

export default function LessonPlayer() {
  const { slug, num } = useLocalSearchParams<{ slug: string; num: string }>();
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const lessonNum = parseInt(num ?? '1', 10);
  const steps = loadBundledLesson(slug ?? '', lessonNum);

  if (!steps) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>ยังไม่มีเนื้อหาบทเรียนนี้ในแอป</Text>
        <Button label="กลับ" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <LessonRunner
      steps={steps}
      onExit={() => router.back()}
      onComplete={async (perfect) => {
        const res = await completeLesson(slug ?? '', lessonNum, perfect);
        await refreshProfile();
        return { xp: res.xp, reason: res.reason };
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, backgroundColor: colors.bg, padding: spacing.xl },
  muted: { color: colors.textMuted, fontSize: font.body },
});
