import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronLeft, Flame, Lock, Target } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { getCourse, getLessonsDone, type Course } from '../../lib/data';
import { bundledLessonCount } from '../../lib/lesson-content';
import { Button, Loading } from '../../components/ui';
import { Mascot } from '../../components/mascot';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

const LEVEL_LABEL: Record<string, string> = { beginner: 'ระดับเริ่มต้น', intermediate: 'ระดับกลาง', advanced: 'ระดับสูง' };

export default function TopicRoadmap() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const { profile, session } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [course, setCourse] = useState<Course | null>(null);
  const [done, setDone] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!topic) return;
    const c = await getCourse(topic);
    setCourse(c);
    if (session?.user && c) setDone(await getLessonsDone(session.user.id, c.slug));
    setLoading(false);
  }, [topic, session?.user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <Loading label="กำลังโหลด..." />;
  if (!course) {
    return (
      <View style={styles.center}><Text style={styles.muted}>ไม่พบหัวข้อนี้</Text></View>
    );
  }

  const locked = course.is_pro && profile?.plan !== 'pro';
  const total = bundledLessonCount(course.slug) || course.lessons;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const currentN = Math.min(done + 1, total);
  const toGoal = Math.max(0, Math.min(total - done, 2));
  const nodes = Array.from({ length: total }, (_, i) => {
    const n = i + 1;
    const status: 'done' | 'current' | 'locked' = n <= done ? 'done' : n === done + 1 ? 'current' : 'locked';
    return { n, status };
  });

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        {/* header */}
        <View style={styles.header}>
          <View style={styles.headRow}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <ChevronLeft size={20} color={colors.text} strokeWidth={2.4} />
            </Pressable>
            <View style={styles.headMid}>
              <Text style={styles.headTitle} numberOfLines={1}>{course.title}</Text>
              <Text style={styles.headSub}>{LEVEL_LABEL[course.level] ?? course.level} · {total} บทเรียน</Text>
            </View>
            <View style={styles.pctPill}><Text style={styles.pctText}>{pct}%</Text></View>
          </View>
          <View style={styles.bar}><View style={[styles.barFill, { width: `${pct}%` }]} /></View>
        </View>

        {/* daily goal strip */}
        {!locked && (
          <View style={styles.goalStrip}>
            <View style={styles.goalIcon}><Target size={18} color={colors.primary} /></View>
            <View style={styles.flex}>
              <Text style={styles.goalTitle}>เป้าหมายวันนี้</Text>
              <View style={styles.goalSubRow}>
                <Text style={styles.goalSub}>จบอีก {toGoal} บท เพื่อรักษาสตรีค</Text>
                <Flame size={12} color={colors.punch} fill={colors.punch} />
              </View>
            </View>
          </View>
        )}

        {locked ? (
          <View style={styles.lockCard}>
            <View style={styles.lockHead}>
              <Lock size={18} color={colors.primaryInk} />
              <Text style={styles.lockTitle}>หัวข้อนี้สำหรับ Pro</Text>
            </View>
            <Button label="อัปเกรดเป็น Pro" variant="sun" onPress={() => router.push('/upgrade')} />
          </View>
        ) : (
          <View style={styles.path}>
            {nodes.map((node, i) => (
              <View key={node.n} style={styles.nodeWrap}>
                {i > 0 && <View style={[styles.connector, node.status === 'done' && styles.connectorDone]} />}
                <View style={styles.nodeCol}>
                  <Pressable
                    disabled={node.status === 'locked'}
                    onPress={() => router.push(`/lesson/${course.slug}/${node.n}`)}
                    style={[
                      styles.circle,
                      node.status === 'done' && styles.circleDone,
                      node.status === 'current' && styles.circleCurrent,
                      node.status === 'locked' && styles.circleLocked,
                    ]}
                  >
                    {node.status === 'done' ? (
                      <Check size={22} color="#FFFFFF" strokeWidth={3} />
                    ) : node.status === 'locked' ? (
                      <Lock size={18} color={colors.textFaint} />
                    ) : (
                      <Text style={styles.circleNum}>{node.n}</Text>
                    )}
                  </Pressable>
                  {node.status === 'current' && (
                    <Mascot pose="point" size={58} style={styles.pointMascot} />
                  )}
                  <Text style={[styles.nodeTitle, node.status === 'locked' && styles.nodeTitleLocked]}>บทที่ {node.n}</Text>
                  {node.status === 'current' && (
                    <Pressable style={styles.startBtn} onPress={() => router.push(`/lesson/${course.slug}/${currentN}`)}>
                      <Text style={styles.startBtnText}>เริ่มบทนี้</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  muted: { color: colors.textMuted, fontFamily: fonts.bodyMedium },
  flex: { flex: 1 },

  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', ...shadow.soft },
  headMid: { flex: 1 },
  headTitle: { fontFamily: fonts.display, fontSize: font.h3, color: colors.text },
  headSub: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: colors.textMuted, marginTop: 1 },
  pctPill: { backgroundColor: colors.mintTint, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 5 },
  pctText: { fontFamily: fonts.display, fontSize: font.small, color: colors.success },
  bar: { height: 9, borderRadius: radius.pill, backgroundColor: '#EFEBF7', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },

  goalStrip: { flexDirection: 'row', alignItems: 'center', gap: 11, marginHorizontal: spacing.lg, backgroundColor: colors.heroTint, borderRadius: 18, padding: 12, paddingHorizontal: 14 },
  goalIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  goalTitle: { fontFamily: fonts.title, fontSize: font.small, color: colors.primaryInk },
  goalSubRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  goalSub: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: colors.body },

  lockCard: { margin: spacing.lg, backgroundColor: colors.sunTint, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  lockHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lockTitle: { color: colors.primaryInk, fontSize: font.h3, fontFamily: fonts.title },

  path: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, alignItems: 'center' },
  nodeWrap: { alignItems: 'center' },
  connector: { width: 4, height: 26, backgroundColor: '#E4DCF7', borderRadius: 2 },
  connectorDone: { backgroundColor: colors.success },
  nodeCol: { alignItems: 'center', position: 'relative' },
  circle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', ...shadow.soft },
  circleDone: { backgroundColor: colors.success },
  circleCurrent: { backgroundColor: colors.primary, ...shadow.card },
  circleLocked: { backgroundColor: '#EFEBF7' },
  circleNum: { fontFamily: fonts.display, fontSize: font.h3, color: '#FFFFFF' },
  pointMascot: { position: 'absolute', left: 56, top: -12 },
  nodeTitle: { fontFamily: fonts.bodyBold, fontSize: font.small, color: colors.text, marginTop: 8 },
  nodeTitleLocked: { color: colors.textFaint },
  startBtn: { marginTop: 9, backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 9, shadowColor: colors.primaryInk, shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  startBtnText: { fontFamily: fonts.display, fontSize: font.small, color: '#FFFFFF' },
});
