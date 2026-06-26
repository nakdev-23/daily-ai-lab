import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Lock } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { getCourse, getLessonsDone, type Course } from '../../lib/data';
import { bundledLessonCount } from '../../lib/lesson-content';
import { Loading, Pill, ProgressBar } from '../../components/ui';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

export default function CourseDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { profile, session } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [done, setDone] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!slug) return;
    const c = await getCourse(slug);
    setCourse(c);
    if (session?.user && c) setDone(await getLessonsDone(session.user.id, c.slug));
    setLoading(false);
  }, [slug, session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading) return <Loading label="กำลังโหลด..." />;
  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>ไม่พบคอร์สนี้</Text>
      </View>
    );
  }

  const locked = course.is_pro && profile?.plan !== 'pro';
  // Use bundled lesson count as the source of truth for what can be opened on
  // mobile; fall back to the course's declared lesson count.
  const total = bundledLessonCount(course.slug) || course.lessons;
  const lessons = Array.from({ length: total }, (_, i) => i + 1);
  const pct = total ? (done / total) * 100 : 0;

  return (
    <>
      <Stack.Screen options={{ title: course.title }} />
      <FlatList
        style={styles.screen}
        contentContainerStyle={styles.content}
        data={locked ? [] : lessons}
        keyExtractor={(n) => String(n)}
        ListHeaderComponent={
          <View style={styles.head}>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.desc}>{course.description}</Text>
            <ProgressBar pct={pct} />
            <Text style={styles.meta}>
              {done}/{total} บท ({Math.round(pct)}%)
            </Text>
            {locked ? (
              <Pressable style={styles.lockCard} onPress={() => router.push('/upgrade')}>
                <View style={styles.lockHead}>
                  <Lock size={18} color={colors.primaryInk} />
                  <Text style={styles.lockTitle}>คอร์สนี้สำหรับ Pro</Text>
                </View>
                <Text style={styles.lockText}>แตะเพื่ออัปเกรดและปลดล็อกทุกบทเรียน</Text>
              </Pressable>
            ) : null}
          </View>
        }
        renderItem={({ item: n }) => {
          const completed = n <= done;
          // Sequential unlock: only the next undone lesson is playable.
          const unlocked = n <= done + 1;
          return (
            <Pressable
              style={[styles.lesson, !unlocked && styles.lessonLocked]}
              disabled={!unlocked}
              onPress={() => router.push(`/lesson/${course.slug}/${n}`)}
            >
              <View style={[styles.lessonNum, completed && styles.lessonNumDone]}>
                {completed ? (
                  <Check size={18} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Text style={styles.lessonNumText}>{n}</Text>
                )}
              </View>
              <Text style={styles.lessonTitle}>บทที่ {n}</Text>
              {completed ? (
                <Pill text="เรียนแล้ว" color={colors.success} tint={colors.mintTint} />
              ) : unlocked ? (
                <Pill text="เริ่ม" color={colors.primary} tint={colors.heroTint} />
              ) : (
                <Lock size={16} color={colors.textFaint} />
              )}
            </Pressable>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  muted: { color: colors.textMuted, fontFamily: fonts.bodyMedium },
  head: { gap: spacing.sm, marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: font.h2, fontFamily: fonts.display },
  desc: { color: colors.body, fontSize: font.small, fontFamily: fonts.bodyMedium, lineHeight: 20 },
  meta: { color: colors.textMuted, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
  lockCard: {
    backgroundColor: colors.sunTint,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: 4,
    marginTop: spacing.sm,
  },
  lockHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lockTitle: { color: colors.primaryInk, fontSize: font.h3, fontFamily: fonts.title },
  lockText: { color: colors.body, fontSize: font.small, fontFamily: fonts.bodyMedium },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadow.soft,
  },
  lessonLocked: { opacity: 0.45 },
  lessonNum: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.heroTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumDone: { backgroundColor: colors.success },
  lessonNumText: { color: colors.primary, fontFamily: fonts.display },
  lessonTitle: { flex: 1, color: colors.text, fontSize: font.body, fontFamily: fonts.bodySemibold },
  lockIcon: { fontSize: 16 },
});
