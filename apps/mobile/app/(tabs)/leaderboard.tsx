import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronRight, Flame, Globe, Medal, Trophy } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { getLeaderboard, type LeaderboardRow } from '../../lib/data';
import { Avatar, Loading } from '../../components/ui';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

const MEDAL = ['#E0A800', '#9AA3B2', '#C9803F'];
const PLINTH = ['#FFD43A', '#D7DBE3', '#E2A977'];
const PLINTH_H = [78, 58, 44];

export default function Leaderboard() {
  const { session, profile } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);

  const load = useCallback(async () => { setRows(await getLeaderboard(50)); }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (!rows) return <Loading label="กำลังโหลดอันดับ..." />;

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  // display order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].map((r, i) => ({ r, place: i === 1 ? 1 : i === 0 ? 2 : 3 }));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>อันดับ</Text>
        <View style={styles.leaguePill}>
          <Trophy size={13} color={colors.sunDeep} fill={colors.sun} />
          <Text style={styles.leagueText}>ลีกทอง</Text>
        </View>
      </View>
      <Text style={styles.sub}>เหลืออีก 5 วันจบรอบ · ลีกในเครื่อง</Text>

      {/* podium */}
      <View style={styles.podium}>
        {podiumOrder.map(({ r, place }) =>
          r ? (
            <View key={r.user_id} style={styles.podCol}>
              <Medal size={20} color={MEDAL[place - 1]} />
              <View style={styles.podAvatar}>
                <Avatar name={r.display_name ?? '?'} size={place === 1 ? 56 : 46} />
              </View>
              <Text style={styles.podName} numberOfLines={1}>{r.display_name ?? 'นักเรียน'}</Text>
              <Text style={styles.podXp}>{r.xp} XP</Text>
              <View style={[styles.plinth, { height: PLINTH_H[place - 1], backgroundColor: PLINTH[place - 1] }]}>
                <Text style={styles.plinthNum}>{place}</Text>
              </View>
            </View>
          ) : (
            <View key={place} style={styles.podCol} />
          ),
        )}
      </View>

      {/* rows */}
      <View style={styles.rows}>
        {rest.map((r) => {
          const isMe = r.user_id === session?.user?.id;
          return (
            <View key={r.user_id} style={[styles.row, isMe && styles.rowMe]}>
              <Text style={styles.rank}>{r.rank}</Text>
              <Avatar name={r.display_name ?? '?'} size={38} />
              <View style={styles.nameWrap}>
                <Text style={styles.name} numberOfLines={1}>{r.display_name ?? 'นักเรียน'}{isMe ? ' (คุณ)' : ''}</Text>
                <View style={styles.streakRow}>
                  <Flame size={11} color={colors.punch} fill={colors.punch} />
                  <Text style={styles.streak}>{r.streak_current} วัน</Text>
                </View>
              </View>
              <Text style={styles.xp}>{r.xp}</Text>
            </View>
          );
        })}
      </View>

      {profile?.plan !== 'pro' && (
        <Pressable style={styles.proCta} onPress={() => router.push('/upgrade')}>
          <View style={styles.proIcon}><Globe size={20} color={colors.primary} /></View>
          <View style={styles.flex}>
            <Text style={styles.proTitle}>แข่งระดับโลกด้วย Pro</Text>
            <Text style={styles.proSub}>เทียบอันดับกับผู้เรียนทั่วประเทศ</Text>
          </View>
          <ChevronRight size={18} color={colors.primary} strokeWidth={2.4} />
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.display, fontSize: font.h1, color: colors.text },
  leaguePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.sunTint, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  leagueText: { fontFamily: fonts.display, fontSize: font.tiny, color: colors.primaryInk },
  sub: { fontFamily: fonts.bodyMedium, fontSize: font.small, color: colors.textMuted, marginTop: 2, marginBottom: spacing.lg },

  podium: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.lg },
  podCol: { flex: 1, alignItems: 'center' },
  podAvatar: { marginTop: 5 },
  podName: { fontFamily: fonts.title, fontSize: font.tiny, color: colors.text, marginTop: 6, textAlign: 'center' },
  podXp: { fontFamily: fonts.bodyMedium, fontSize: 10.5, color: colors.textMuted, marginBottom: 6 },
  plinth: { width: '100%', borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8 },
  plinthNum: { fontFamily: fonts.display, fontSize: font.h3, color: colors.primaryInk },

  rows: { gap: 9 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, ...shadow.soft },
  rowMe: { backgroundColor: colors.heroTint },
  rank: { fontFamily: fonts.display, fontSize: font.small, color: colors.textMuted, width: 24 },
  nameWrap: { flex: 1 },
  name: { fontFamily: fonts.title, fontSize: font.body, color: colors.text },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  streak: { fontFamily: fonts.bodySemibold, fontSize: font.tiny, color: colors.punch },
  xp: { fontFamily: fonts.display, fontSize: font.small, color: colors.primary },

  proCta: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: spacing.lg, backgroundColor: colors.heroTint, borderRadius: 18, padding: 14 },
  proIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  proTitle: { fontFamily: fonts.display, fontSize: font.body, color: colors.primaryInk },
  proSub: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: colors.body, marginTop: 1 },
});
