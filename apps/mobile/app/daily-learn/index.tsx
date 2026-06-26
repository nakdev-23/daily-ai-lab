import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Flame, Zap } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { getCourses, getCourseProgress, getGameState, type Course, type GameState } from '../../lib/data';
import { Card, Loading, Pill, ProgressBar } from '../../components/ui';
import { ToolLogo } from '../../components/tool-logo';
import { colors, fonts, font, radius, spacing } from '../../lib/theme';

const GOAL_LESSONS = 3; // mirrors the default free daily quota
const DAYS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

export default function DailyLearn() {
  const { profile, session } = useAuth();
  const router = useRouter();
  const [gs, setGs] = useState<GameState | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const c = await getCourses();
    setCourses(c.filter((x) => x.show_in_daily !== false));
    if (session?.user) {
      const [g, p] = await Promise.all([
        getGameState(session.user.id),
        getCourseProgress(session.user.id),
      ]);
      setGs(g);
      setProgress(p);
    }
    setReady(true);
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!ready) return <Loading label="กำลังโหลด..." />;

  const lessonsToday = gs?.lessons_today ?? 0;
  const streak = gs?.streak_current ?? 0;
  const goalPct = Math.min(100, (lessonsToday / GOAL_LESSONS) * 100);

  // Light up today + the streak run's recent days. No per-day history exists, so
  // approximate from streak length ending today (matches the web's heuristic).
  const todayIdx = (() => {
    const d = new Date().getDay(); // 0=Sun
    return d === 0 ? 6 : d - 1;
  })();
  const week = DAYS.map((d, i) => ({
    d,
    today: i === todayIdx,
    on: i === todayIdx ? lessonsToday > 0 : i < todayIdx && todayIdx - i < streak,
  }));

  const firstTopic = courses.find((c) => {
    const done = progress[c.slug] ?? 0;
    return done > 0 && done < c.lessons;
  }) ?? courses[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card style={styles.hero}>
        <View style={styles.eyebrowRow}>
          <Flame size={13} color={colors.streak} fill={colors.streak} />
          <Text style={styles.eyebrow}>เป้าหมายวันนี้ · สตรีค {streak} วัน</Text>
        </View>
        <Text style={styles.heroTitle}>
          สวัสดี {profile?.displayName ?? 'นักเรียน'}! <Text style={styles.heroAccent}>เรียนวันละ 15 นาที</Text>
        </Text>
        <View style={styles.ringRow}>
          <View style={styles.ring}>
            <Text style={styles.ringNum}>{Math.min(lessonsToday, GOAL_LESSONS)}</Text>
            <Text style={styles.ringDen}>/ {GOAL_LESSONS} บท</Text>
          </View>
          <View style={styles.heroMid}>
            <Text style={styles.heroMsg}>
              {lessonsToday > 0
                ? `วันนี้เรียนไปแล้ว ${lessonsToday} บท เก่งมาก!`
                : 'เริ่มบทแรกเพื่อพิชิตเป้าหมายวันนี้'}
            </Text>
            <ProgressBar pct={goalPct} color={colors.streak} />
          </View>
        </View>
        {firstTopic && (
          <Pressable style={styles.cta} onPress={() => router.push(`/daily-learn/${firstTopic.slug}`)}>
            <Text style={styles.ctaText}>เรียนต่อ ›</Text>
          </Pressable>
        )}
      </Card>

      <Card style={styles.weekCard}>
        <Text style={styles.weekTitle}>สัปดาห์นี้</Text>
        <View style={styles.weekRow}>
          {week.map((s, i) => (
            <View key={i} style={styles.day}>
              <View style={[styles.dayDot, s.on && styles.dayOn, s.today && styles.dayToday]}>
                {s.today ? (
                  <Zap size={15} color={colors.punch} fill={colors.punch} />
                ) : s.on ? (
                  <Flame size={15} color={colors.punch} fill={colors.punch} />
                ) : null}
              </View>
              <Text style={styles.dayLabel}>{s.d}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Text style={styles.sectionTitle}>เลือกหัวข้อที่อยากเรียน</Text>
      <Text style={styles.sectionSub}>แต่ละบทสั้น เรียนจบใน 15 นาที</Text>

      {courses.map((c) => {
        const done = progress[c.slug] ?? 0;
        const pct = c.lessons ? (done / c.lessons) * 100 : 0;
        const locked = c.is_pro && profile?.plan !== 'pro';
        return (
          <Pressable key={c.id} onPress={() => router.push(`/daily-learn/${c.slug}`)}>
            <Card style={styles.topic}>
              <ToolLogo tool={c.tool} size={44} />
              <View style={styles.topicMid}>
                <View style={styles.topicTop}>
                  <Text style={styles.topicTitle} numberOfLines={1}>{c.title}</Text>
                  {locked ? <Pill text="PRO" color={colors.primaryInk} tint={colors.sunTint} /> : null}
                </View>
                <ProgressBar pct={pct} />
                <Text style={styles.topicMeta}>
                  {done}/{c.lessons} บท · {Math.round(pct)}%
                </Text>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.md },
  hero: { gap: spacing.md, backgroundColor: colors.heroTint },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  eyebrow: { color: colors.streak, fontSize: font.tiny, fontFamily: fonts.bodyBold, letterSpacing: 0.4 },
  heroTitle: { color: colors.text, fontSize: font.h3, fontFamily: fonts.display, lineHeight: 26 },
  heroAccent: { color: colors.primary },
  ringRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  ring: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 6,
    borderColor: colors.streak,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringNum: { color: colors.text, fontSize: font.h2, fontFamily: fonts.display },
  ringDen: { color: colors.textMuted, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
  heroMid: { flex: 1, gap: spacing.sm },
  heroMsg: { color: colors.body, fontSize: font.small, fontFamily: fonts.bodyMedium },
  cta: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.md, alignItems: 'center' },
  ctaText: { color: '#FFFFFF', fontSize: font.body, fontFamily: fonts.title },
  weekCard: { gap: spacing.md },
  weekTitle: { color: colors.text, fontSize: font.h3, fontFamily: fonts.title },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: 6 },
  dayDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOn: { backgroundColor: colors.sunTint },
  dayToday: { borderWidth: 2, borderColor: colors.streak },
  dayIcon: { fontSize: 15 },
  dayLabel: { color: colors.textMuted, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
  sectionTitle: { color: colors.text, fontSize: font.h3, fontFamily: fonts.display, marginTop: spacing.sm },
  sectionSub: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyMedium, marginTop: -spacing.sm },
  topic: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  topicMid: { flex: 1, gap: spacing.sm },
  topicTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  topicTitle: { color: colors.text, fontSize: font.body, fontFamily: fonts.title, flex: 1 },
  topicMeta: { color: colors.textMuted, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
});
