import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { BookOpen, Check, Flame, Target, Trophy, Zap, type LucideIcon } from 'lucide-react-native';
import { useAuth } from '../lib/auth';
import { getGameState, type GameState } from '../lib/data';
import { Card, Loading, ProgressBar } from '../components/ui';
import { colors, fonts, font, spacing } from '../lib/theme';

type Mission = { Icon: LucideIcon; title: string; current: number; target: number; reward: number };

function buildMissions(gs: GameState): Mission[] {
  return [
    { Icon: BookOpen, title: 'เรียน 1 บทเรียนวันนี้', current: gs.lessons_today, target: 1, reward: 10 },
    { Icon: Flame, title: 'รักษาสตรีคต่อเนื่อง', current: gs.streak_current > 0 ? 1 : 0, target: 1, reward: 5 },
    { Icon: Zap, title: 'เรียนให้ครบ 3 บทวันนี้', current: gs.lessons_today, target: 3, reward: 20 },
    { Icon: Trophy, title: 'ทำสตรีคให้ถึง 7 วัน', current: gs.streak_current, target: 7, reward: 50 },
  ];
}

export default function Missions() {
  const { session } = useAuth();
  const [gs, setGs] = useState<GameState | null>(null);

  const load = useCallback(async () => {
    if (session?.user) setGs(await getGameState(session.user.id));
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!gs) return <Loading label="กำลังโหลดภารกิจ..." />;

  const missions = buildMissions(gs);
  const doneCount = missions.filter((m) => m.current >= m.target).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.head}>
        <Target size={24} color={colors.primary} />
        <Text style={styles.title}>ภารกิจรายวัน</Text>
      </View>
      <Text style={styles.sub}>
        ทำสำเร็จแล้ว {doneCount}/{missions.length} ภารกิจ
      </Text>

      {missions.map((m) => {
        const complete = m.current >= m.target;
        const pct = Math.min(100, (m.current / m.target) * 100);
        return (
          <Card key={m.title} style={[styles.card, complete && styles.cardDone]}>
            <View style={styles.cardTop}>
              <View style={styles.iconTile}>
                <m.Icon size={22} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.missionTitle}>{m.title}</Text>
                <Text style={styles.reward}>+{m.reward} XP</Text>
              </View>
              {complete ? (
                <View style={styles.checkTile}>
                  <Check size={16} color="#FFFFFF" strokeWidth={3} />
                </View>
              ) : null}
            </View>
            <ProgressBar pct={pct} color={complete ? colors.success : colors.primary} />
            <Text style={styles.progress}>
              {Math.min(m.current, m.target)}/{m.target}
            </Text>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { color: colors.text, fontSize: font.h2, fontFamily: fonts.display },
  sub: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyMedium, marginTop: -spacing.xs },
  card: { gap: spacing.sm },
  cardDone: { borderWidth: 2, borderColor: colors.success },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  iconTile: { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.heroTint, alignItems: 'center', justifyContent: 'center' },
  missionTitle: { color: colors.text, fontSize: font.body, fontFamily: fonts.bodyBold },
  reward: { color: colors.primary, fontSize: font.tiny, fontFamily: fonts.bodyBold },
  checkTile: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  progress: { color: colors.textMuted, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
});
