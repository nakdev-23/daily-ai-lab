import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { getCourses, getCourseProgress, type Course } from '../../lib/data';
import { hasBundledCourse } from '../../lib/lesson-content';
import { ProgressBar, Pill, Loading } from '../../components/ui';
import { ToolLogo } from '../../components/tool-logo';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

const LEVEL_LABEL: Record<string, string> = {
  beginner: 'พื้นฐาน',
  intermediate: 'กลาง',
  advanced: 'สูง',
};

export default function Learn() {
  const { profile, session } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    const c = await getCourses();
    setCourses(c);
    if (session?.user) setProgress(await getCourseProgress(session.user.id));
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!courses) return <Loading label="กำลังโหลดคอร์ส..." />;

  const isPro = profile?.plan === 'pro';

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={courses}
      keyExtractor={(c) => c.id}
      ListHeaderComponent={<Text style={styles.title}>คอร์สเรียน AI</Text>}
      ListEmptyComponent={<Text style={styles.empty}>ยังไม่มีคอร์สที่เผยแพร่</Text>}
      renderItem={({ item }) => {
        const done = progress[item.slug] ?? 0;
        const pct = item.lessons ? (done / item.lessons) * 100 : 0;
        const locked = item.is_pro && !isPro;
        const bundled = hasBundledCourse(item.slug);
        return (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/course/${item.slug}`)}
          >
            <View style={styles.cardTop}>
              <ToolLogo tool={item.tool} size={44} />
              <Text style={styles.courseTitle} numberOfLines={1}>{item.title}</Text>
              {locked ? <Pill text="PRO" color={colors.primaryInk} tint={colors.sunTint} /> : null}
            </View>
            <Text style={styles.courseDesc} numberOfLines={2}>
              {item.description || 'เรียนรู้ทีละขั้น พร้อมแบบทดสอบท้ายบท'}
            </Text>
            <View style={styles.metaRow}>
              <Pill text={LEVEL_LABEL[item.level] ?? item.level} color={colors.accent} />
              <Text style={styles.meta}>{item.lessons} บท</Text>
              {!bundled ? <Text style={styles.metaFaint}>· เนื้อหาออนไลน์</Text> : null}
            </View>
            <ProgressBar pct={pct} />
            <Text style={styles.meta}>
              {done}/{item.lessons} บท ({Math.round(pct)}%)
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { color: colors.text, fontSize: font.h2, fontFamily: fonts.display, marginBottom: spacing.xs },
  empty: { color: colors.textMuted, fontFamily: fonts.bodyMedium, textAlign: 'center', marginTop: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  courseTitle: { color: colors.text, fontSize: font.h3, fontFamily: fonts.title, flex: 1 },
  courseDesc: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyRegular, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  meta: { color: colors.textMuted, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
  metaFaint: { color: colors.textFaint, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
});
