import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  Heart,
  Target,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { getCourses, getCourseProgress, getGameState, type Course, type GameState } from '../../lib/data';
import { Mascot } from '../../components/mascot';
import { ToolLogo } from '../../components/tool-logo';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

const GOAL = 3;
const DAYS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

export default function Home() {
  const { profile, session } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [gs, setGs] = useState<GameState | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!session?.user) return;
    const [g, c, p] = await Promise.all([
      getGameState(session.user.id),
      getCourses(),
      getCourseProgress(session.user.id),
    ]);
    setGs(g);
    setCourses(c.filter((x) => x.show_in_daily !== false));
    setProgress(p);
  }, [session?.user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const streak = gs?.streak_current ?? 0;
  const lessonsToday = gs?.lessons_today ?? 0;
  const isPro = profile?.plan === 'pro';
  const toGoal = Math.max(0, GOAL - lessonsToday);

  const inProgress = courses.filter((c) => {
    const d = progress[c.slug] ?? 0;
    return d > 0 && d < c.lessons;
  });
  const continueList = (inProgress.length ? inProgress : courses).slice(0, 3);
  const firstTopic = inProgress[0] ?? courses[0];

  const quests: { Icon: LucideIcon; label: string; current: number; target: number; tint: string; color: string }[] = [
    { Icon: BookOpen, label: 'เรียน 1 บทวันนี้', current: lessonsToday, target: 1, tint: colors.heroTint, color: colors.primary },
    { Icon: Zap, label: `เรียนครบ ${GOAL} บท`, current: lessonsToday, target: GOAL, tint: colors.sunTint, color: colors.sunDeep },
    { Icon: Target, label: 'สตรีค 7 วัน', current: streak, target: 7, tint: colors.berryTint, color: colors.punch },
  ];

  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();
  const week = DAYS.map((d, i) => ({
    label: d,
    today: i === todayIdx,
    on: i === todayIdx ? lessonsToday > 0 : i < todayIdx && todayIdx - i < streak,
  }));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} tintColor={colors.primary} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />
      }
    >
      {/* top status band */}
      <View style={styles.statusBand}>
        <View style={[styles.statChip, { backgroundColor: colors.sunTint }]}>
          <Flame size={15} color={colors.punch} fill={colors.punch} />
          <Text style={[styles.statChipText, { color: colors.punch }]}>{streak}</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colors.heroTint }]}>
          <Zap size={15} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.statChipText, { color: colors.primary }]}>{gs?.xp ?? 0}</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colors.berryTint }]}>
          <Heart size={15} color={colors.heart} fill={colors.heart} />
          <Text style={[styles.statChipText, { color: colors.heart }]}>{isPro ? '∞' : (gs?.hearts ?? 5)}</Text>
        </View>
      </View>

      {/* greeting hero (violet card) */}
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <View style={styles.heroTextWrap}>
          <Text style={styles.heroGreet}>สวัสดี {profile?.displayName ?? 'นักเรียน'}!</Text>
          <Text style={styles.heroSub}>
            {toGoal > 0 ? <>เหลืออีก <Text style={styles.heroSubBold}>{toGoal} บท</Text> ก็ครบเป้าวันนี้</> : 'ครบเป้าวันนี้แล้ว เก่งมาก!'}
          </Text>
          {firstTopic && (
            <Pressable
              onPress={() => router.push(`/daily-learn/${firstTopic.slug}`)}
              style={({ pressed }) => [styles.heroCta, { transform: [{ translateY: pressed ? 5 : 0 }], marginBottom: pressed ? 0 : 5 }]}
            >
              <Text style={styles.heroCtaText}>เรียนต่อ</Text>
              <ChevronRight size={16} color={colors.primaryInk} strokeWidth={2.8} />
            </Pressable>
          )}
        </View>
        <Mascot pose="thumbsup" size={124} style={styles.heroMascot} />
      </View>

      {/* continue learning */}
      {continueList.length > 0 && (
        <View>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>เรียนต่อ</Text>
            <Pressable onPress={() => router.push('/(tabs)/learn')}>
              <Text style={styles.sectionLink}>ทั้งหมด</Text>
            </Pressable>
          </View>
          <View style={styles.list}>
            {continueList.map((c) => {
              const done = progress[c.slug] ?? 0;
              const pct = c.lessons ? (done / c.lessons) * 100 : 0;
              return (
                <Pressable key={c.id} style={styles.contCard} onPress={() => router.push(`/daily-learn/${c.slug}`)}>
                  <ToolLogo tool={c.tool} size={44} />
                  <View style={styles.contMid}>
                    <Text style={styles.contTitle} numberOfLines={1}>{c.title}</Text>
                    <View style={styles.bar}><View style={[styles.barFill, { width: `${pct}%` }]} /></View>
                  </View>
                  <Text style={styles.contFrac}>{done}/{c.lessons}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* daily quests */}
      <View style={styles.questCard}>
        <View style={styles.questHead}>
          <Text style={styles.cardTitle}>เควสต์รายวัน</Text>
          <View style={styles.timeChip}>
            <Clock size={12} color={colors.punch} />
            <Text style={styles.timeChipText}>วันนี้</Text>
          </View>
        </View>
        <View style={styles.questList}>
          {quests.map((q) => {
            const pct = Math.min(100, (q.current / q.target) * 100);
            const done = q.current >= q.target;
            return (
              <View key={q.label} style={styles.questRow}>
                <View style={[styles.questChip, { backgroundColor: q.tint }]}>
                  {done ? <Check size={18} color={q.color} strokeWidth={3} /> : <q.Icon size={18} color={q.color} />}
                </View>
                <View style={styles.questMid}>
                  <View style={styles.questLabelRow}>
                    <Text style={styles.questLabel}>{q.label}</Text>
                    <Text style={styles.questFrac}>{Math.min(q.current, q.target)}/{q.target}</Text>
                  </View>
                  <View style={styles.bar}><View style={[styles.barFill, { width: `${pct}%`, backgroundColor: done ? colors.success : colors.primary }]} /></View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* week streak (yellow card) */}
      <View style={styles.weekCard}>
        <View style={styles.weekHead}>
          <Text style={styles.weekTitle}>สัปดาห์นี้</Text>
          <View style={styles.weekStreak}>
            <Flame size={15} color={colors.punch} fill={colors.punch} />
            <Text style={styles.weekStreakText}>{streak} วัน</Text>
          </View>
        </View>
        <View style={styles.weekRow}>
          {week.map((d, i) => (
            <View key={i} style={styles.day}>
              <View style={[styles.dayDot, d.on && styles.dayDotOn, d.today && styles.dayDotToday]}>
                {d.today ? (
                  <Zap size={14} color="#FFFFFF" fill="#FFFFFF" />
                ) : d.on ? (
                  <Flame size={14} color="#FFFFFF" fill="#FFFFFF" />
                ) : null}
              </View>
              <Text style={styles.dayLabel}>{d.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* go pro */}
      {!isPro && (
        <Pressable style={styles.pro} onPress={() => router.push('/upgrade')}>
          <View style={styles.proCrown}><Crown size={22} color={colors.sun} fill={colors.sun} /></View>
          <View style={styles.proMid}>
            <Text style={styles.proTitle}>เปิด Daily AI Lab Pro</Text>
            <Text style={styles.proSub}>บทไม่จำกัด · หัวใจไม่จำกัด · ทุกเส้นทาง</Text>
          </View>
          <ChevronRight size={18} color={colors.sun} strokeWidth={2.6} />
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },

  statusBand: { flexDirection: 'row', gap: spacing.sm },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  statChipText: { fontFamily: fonts.display, fontSize: font.body },

  hero: { position: 'relative', backgroundColor: colors.primary, borderRadius: 26, padding: 20, paddingRight: 110, overflow: 'hidden', minHeight: 150, ...shadow.card },
  heroCircle: { position: 'absolute', right: -18, top: -14, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroTextWrap: { position: 'relative', zIndex: 2 },
  heroGreet: { fontFamily: fonts.display, fontSize: 21, color: '#FFFFFF', letterSpacing: -0.3 },
  heroSub: { fontSize: font.small, color: 'rgba(255,255,255,0.82)', marginTop: 5, lineHeight: 19, fontFamily: fonts.bodyMedium },
  heroSubBold: { color: colors.sun, fontFamily: fonts.bodyBold },
  heroCta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 14, backgroundColor: colors.sun, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 11, shadowColor: colors.sunDeep, shadowOpacity: 0.5, shadowRadius: 0, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  heroCtaText: { fontFamily: fonts.title, fontSize: font.body, color: colors.primaryInk },
  heroMascot: { position: 'absolute', right: -6, bottom: -10, zIndex: 1 },

  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.display, fontSize: font.h3, color: colors.text },
  sectionLink: { fontFamily: fonts.bodyBold, fontSize: font.small, color: colors.primary },
  list: { gap: spacing.sm },

  contCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, ...shadow.soft },
  contMid: { flex: 1, gap: 8 },
  contTitle: { fontFamily: fonts.title, fontSize: font.body, color: colors.text },
  contFrac: { fontFamily: fonts.display, fontSize: font.small, color: colors.textMuted },

  bar: { height: 7, borderRadius: radius.pill, backgroundColor: '#EFEBF7', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },

  questCard: { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.lg, ...shadow.card },
  questHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  cardTitle: { fontFamily: fonts.display, fontSize: font.h3, color: colors.text },
  timeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.sunTint, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4 },
  timeChipText: { fontFamily: fonts.bodyBold, fontSize: font.tiny, color: colors.punch },
  questList: { gap: spacing.md },
  questRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  questChip: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  questMid: { flex: 1, gap: 5 },
  questLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  questLabel: { fontFamily: fonts.bodySemibold, fontSize: font.small, color: colors.body },
  questFrac: { fontFamily: fonts.display, fontSize: font.small, color: colors.textMuted },

  weekCard: { backgroundColor: colors.sunTint, borderRadius: radius.xl, padding: spacing.lg },
  weekHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  weekTitle: { fontFamily: fonts.display, fontSize: font.h3, color: colors.primaryInk },
  weekStreak: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  weekStreakText: { fontFamily: fonts.display, fontSize: font.small, color: colors.punch },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: 6 },
  dayDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center' },
  dayDotOn: { backgroundColor: colors.punch },
  dayDotToday: { backgroundColor: colors.primary },
  dayLabel: { fontFamily: fonts.bodyBold, fontSize: font.tiny, color: colors.primaryInk, opacity: 0.7 },

  pro: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.text, borderRadius: radius.xl, padding: spacing.lg, ...shadow.card },
  proCrown: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: 'rgba(255,212,58,0.15)', alignItems: 'center', justifyContent: 'center' },
  proMid: { flex: 1 },
  proTitle: { fontFamily: fonts.title, fontSize: font.body, color: '#FFFFFF' },
  proSub: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
});
