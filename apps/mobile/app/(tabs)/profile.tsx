import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Award,
  BookOpenCheck,
  ChevronRight,
  Crown,
  Flame,
  Globe,
  Medal,
  Settings as SettingsIcon,
  Zap,
} from 'lucide-react-native';
import { getLevelFromXP, getLevelProgress, getXPToNextLevel } from '@daily-ai-lab/core';
import { useAuth } from '../../lib/auth';
import { getCourseProgress, getGameState, type GameState } from '../../lib/data';
import { Button } from '../../components/ui';
import { Mascot } from '../../components/mascot';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

export default function Profile() {
  const { profile, session, signOut } = useAuth();
  const router = useRouter();
  const [gs, setGs] = useState<GameState | null>(null);
  const [lessonsDone, setLessonsDone] = useState(0);

  const load = useCallback(async () => {
    if (!session?.user) return;
    const [g, p] = await Promise.all([getGameState(session.user.id), getCourseProgress(session.user.id)]);
    setGs(g);
    setLessonsDone(Object.entries(p).reduce((n, [k, v]) => (k.startsWith('path:') ? n : n + v), 0));
  }, [session?.user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const xp = gs?.xp ?? 0;
  const level = getLevelFromXP(xp);
  const toNext = getXPToNextLevel(xp);
  const levelPct = getLevelProgress(xp);
  const isPro = profile?.plan === 'pro';

  const stats = [
    { Icon: Flame, color: colors.punch, value: gs?.streak_current ?? 0, label: 'วันสตรีค' },
    { Icon: Zap, color: colors.primary, value: xp, label: 'XP รวม' },
    { Icon: BookOpenCheck, color: colors.success, value: lessonsDone, label: 'บทที่จบ' },
    { Icon: Medal, color: colors.sunDeep, value: `Lv ${level.level}`, label: 'เลเวล' },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* hero */}
      <View style={styles.hero}>
        <LinearGradient colors={['#FFE885', '#FFD43A']} style={styles.avatarRing}>
          <Mascot pose="laptop" size={86} />
        </LinearGradient>
        <Text style={styles.name}>{profile?.displayName ?? 'นักเรียน'}</Text>
        <View style={styles.lvPill}>
          <Zap size={12} color={colors.primaryInk} fill={colors.primaryInk} />
          <Text style={styles.lvText}>Lv.{level.level} · {level.title}</Text>
        </View>
        <View style={styles.xpWrap}>
          <View style={styles.xpLabels}>
            <Text style={styles.xpLabel}>{xp.toLocaleString()} XP</Text>
            <Text style={styles.xpLabel}>{toNext > 0 ? `${(xp + toNext).toLocaleString()} XP` : 'สูงสุด'}</Text>
          </View>
          <View style={styles.bar}><View style={[styles.barFill, { width: `${levelPct}%` }]} /></View>
        </View>
      </View>

      {/* stats 2x2 */}
      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.bg }]}>
              <s.Icon size={22} color={s.color} />
            </View>
            <View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {!isPro && (
        <Pressable style={styles.proCard} onPress={() => router.push('/upgrade')}>
          <View style={styles.proCrown}><Crown size={20} color={colors.sun} fill={colors.sun} /></View>
          <View style={styles.flex}>
            <Text style={styles.proTitle}>อัปเกรดเป็น Pro</Text>
            <Text style={styles.proSub}>ปลดล็อกทุกคอร์ส · ไม่จำกัดบทเรียน</Text>
          </View>
          <ChevronRight size={18} color={colors.sun} strokeWidth={2.6} />
        </Pressable>
      )}

      {/* settings rows */}
      <Text style={styles.sectionTitle}>เมนู</Text>
      <View style={styles.settingsCard}>
        <Row Icon={Award} label="ภารกิจรายวัน" onPress={() => router.push('/missions')} />
        <Row Icon={Globe} label="คู่มือ AI Tools" onPress={() => router.push('/docs')} divider />
        <Row Icon={SettingsIcon} label="ตั้งค่าบัญชี" onPress={() => router.push('/settings')} divider />
      </View>

      <View style={styles.signOut}>
        <Button label="ออกจากระบบ" variant="ghost" onPress={signOut} />
      </View>
      <Text style={styles.version}>Daily AI Lab · v1.0.0</Text>
    </ScrollView>
  );
}

function Row({ Icon, label, onPress, divider }: { Icon: typeof Award; label: string; onPress: () => void; divider?: boolean }) {
  return (
    <Pressable style={[styles.row, divider && styles.rowDivider]} onPress={onPress}>
      <View style={styles.rowIcon}><Icon size={18} color={colors.primary} /></View>
      <Text style={styles.rowLabel}>{label}</Text>
      <ChevronRight size={18} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  flex: { flex: 1 },

  hero: { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.lg, alignItems: 'center', ...shadow.card },
  avatarRing: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', shadowColor: colors.sunDeep, shadowOpacity: 0.28, shadowRadius: 0, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  name: { fontFamily: fonts.display, fontSize: font.h2, color: colors.text, marginTop: 12 },
  lvPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.heroTint, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4, marginTop: 5 },
  lvText: { fontFamily: fonts.bodyBold, fontSize: font.tiny, color: colors.primaryInk },
  xpWrap: { width: '100%', marginTop: 14 },
  xpLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  xpLabel: { fontFamily: fonts.bodySemibold, fontSize: font.tiny, color: colors.textMuted },
  bar: { height: 9, borderRadius: radius.pill, backgroundColor: '#EFEBF7', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: { width: '48.5%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.card, borderRadius: 18, padding: 14, ...shadow.soft },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontFamily: fonts.display, fontSize: font.h3, color: colors.text },
  statLabel: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: colors.textMuted },

  proCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.text, borderRadius: radius.lg, padding: spacing.lg, ...shadow.card },
  proCrown: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: 'rgba(255,212,58,0.15)', alignItems: 'center', justifyContent: 'center' },
  proTitle: { fontFamily: fonts.title, fontSize: font.body, color: '#FFFFFF' },
  proSub: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  sectionTitle: { fontFamily: fonts.display, fontSize: font.h3, color: colors.text, marginTop: spacing.sm },
  settingsCard: { backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', ...shadow.soft },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  rowIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.heroTint, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: fonts.bodySemibold, fontSize: font.body, color: colors.body },
  signOut: { marginTop: spacing.sm },
  version: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: colors.textFaint, textAlign: 'center', marginTop: spacing.sm },
});
