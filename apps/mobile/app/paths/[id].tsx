import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookOpen,
  Check,
  ChevronLeft,
  Flag,
  GraduationCap,
  Hand,
  HelpCircle,
  Lock,
  Rocket,
  Wrench,
  type LucideIcon,
} from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { getCareerPath, getLessonsDone, type CareerPath } from '../../lib/data';
import { Loading } from '../../components/ui';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

const KIND_ICON: Record<string, LucideIcon> = { lesson: BookOpen, quiz: HelpCircle, checkpoint: Flag, project: Wrench };
const KIND_TAG: Record<string, string> = { checkpoint: 'จุดตรวจ', project: 'โปรเจกต์' };

export default function PathDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, session } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [path, setPath] = useState<CareerPath | null>(null);
  const [done, setDone] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    const p = await getCareerPath(id);
    setPath(p);
    if (session?.user && p) setDone(await getLessonsDone(session.user.id, `path:${p.slug}`));
    setLoading(false);
  }, [id, session?.user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <Loading label="กำลังโหลด..." />;
  if (!path) return <View style={styles.center}><Text style={styles.muted}>ไม่พบเส้นทางนี้</Text></View>;

  const locked = path.is_pro && profile?.plan !== 'pro';
  const flatSteps = path.modules.flatMap((m) => m.steps);
  const total = flatSteps.length;
  const xpTotal = flatSteps.reduce((n, s) => n + (s.xp ?? 0), 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  let stepCounter = 0;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {/* violet header */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.headCircle} />
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
          <View style={styles.headRow}>
            <View style={styles.headIcon}><Rocket size={26} color="#FFFFFF" /></View>
            <View style={styles.flex}>
              <Text style={styles.headTitle} numberOfLines={2}>{path.title}</Text>
              <Text style={styles.headMeta}>{total} บท · {path.tools?.length ?? 0} เครื่องมือ · {xpTotal} XP</Text>
            </View>
          </View>
          <View style={styles.headBar}><View style={[styles.headBarFill, { width: `${pct}%` }]} /></View>
          <Text style={styles.headPct}>เรียนไปแล้ว {pct}%</Text>
        </View>

        <View style={styles.body}>
          {/* info cards */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Hand size={20} color={colors.primary} />
              <Text style={styles.infoValue}>ลงมือทำ</Text>
              <Text style={styles.infoLabel}>เน้นโปรเจกต์จริง</Text>
            </View>
            <View style={styles.infoCard}>
              <GraduationCap size={20} color={colors.sunDeep} />
              <Text style={styles.infoValue}>พอร์ต</Text>
              <Text style={styles.infoLabel}>ผลงานเมื่อเรียนจบ</Text>
            </View>
          </View>

          {/* modules */}
          {path.modules.map((mod) => (
            <View key={mod.id} style={styles.module}>
              <Text style={styles.moduleTitle}>{mod.title}</Text>
              <View style={styles.steps}>
                {mod.steps.map((step) => {
                  stepCounter += 1;
                  const n = stepCounter;
                  const status = n <= done ? 'done' : n === done + 1 ? 'current' : 'locked';
                  const Ic = KIND_ICON[step.kind] ?? BookOpen;
                  return (
                    <Pressable
                      key={step.id}
                      disabled={locked || status === 'locked'}
                      onPress={() => router.push(`/paths-learn/${path.slug}/${n}`)}
                      style={[styles.step, status === 'locked' && styles.stepLocked]}
                    >
                      <View style={[styles.dot, status === 'done' && styles.dotDone, status === 'current' && styles.dotCurrent]}>
                        {status === 'done' ? <Check size={16} color="#FFFFFF" strokeWidth={3} /> : status === 'locked' ? <Lock size={14} color={colors.textFaint} /> : <Ic size={16} color={colors.primary} />}
                      </View>
                      <Text style={styles.stepTitle} numberOfLines={1}>{step.title}</Text>
                      {KIND_TAG[step.kind] ? <Text style={styles.stepTag}>{KIND_TAG[step.kind]}</Text> : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {/* paywall */}
          {locked && (
            <Pressable style={styles.paywall} onPress={() => router.push('/upgrade')}>
              <View style={styles.paywallLock}><Lock size={26} color={colors.sun} /></View>
              <Text style={styles.paywallTitle}>ปลดล็อกเส้นทางนี้ด้วย Pro</Text>
              <Text style={styles.paywallSub}>อัปเกรดเพื่อเรียนครบ + รับผลงานเข้าพอร์ต</Text>
              <View style={styles.paywallBtn}><Text style={styles.paywallBtnText}>อัปเกรดเป็น Pro</Text></View>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  muted: { color: colors.textMuted, fontFamily: fonts.bodyMedium },
  flex: { flex: 1 },

  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, overflow: 'hidden' },
  headCircle: { position: 'absolute', right: -20, top: -10, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  headIcon: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  headTitle: { fontFamily: fonts.display, fontSize: font.h2, color: '#FFFFFF' },
  headMeta: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  headBar: { height: 9, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden', marginTop: 16 },
  headBarFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.sun },
  headPct: { fontFamily: fonts.bodySemibold, fontSize: font.tiny, color: 'rgba(255,255,255,0.8)', marginTop: 6 },

  body: { padding: spacing.lg, gap: spacing.lg },
  infoRow: { flexDirection: 'row', gap: spacing.md },
  infoCard: { flex: 1, backgroundColor: colors.card, borderRadius: 18, padding: 14, gap: 4, ...shadow.soft },
  infoValue: { fontFamily: fonts.display, fontSize: font.h3, color: colors.text, marginTop: 4 },
  infoLabel: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: colors.textMuted },

  module: { gap: spacing.sm },
  moduleTitle: { fontFamily: fonts.display, fontSize: font.body + 1, color: colors.primaryInk, marginBottom: 2 },
  steps: { gap: 9 },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, ...shadow.soft },
  stepLocked: { opacity: 0.55 },
  dot: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.heroTint, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.success },
  dotCurrent: { backgroundColor: colors.heroTint, borderWidth: 2, borderColor: colors.primary },
  stepTitle: { flex: 1, fontFamily: fonts.bodySemibold, fontSize: font.small, color: colors.text },
  stepTag: { fontFamily: fonts.bodyBold, fontSize: 10, color: colors.primary, backgroundColor: colors.heroTint, paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.pill, overflow: 'hidden' },

  paywall: { backgroundColor: colors.text, borderRadius: radius.lg, padding: 18, alignItems: 'center', ...shadow.card },
  paywallLock: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: 'rgba(255,212,58,0.15)', alignItems: 'center', justifyContent: 'center' },
  paywallTitle: { fontFamily: fonts.display, fontSize: font.h3, color: '#FFFFFF', marginTop: 10, textAlign: 'center' },
  paywallSub: { fontFamily: fonts.bodyMedium, fontSize: font.small, color: 'rgba(255,255,255,0.65)', marginTop: 4, textAlign: 'center', lineHeight: 20 },
  paywallBtn: { marginTop: 14, backgroundColor: colors.sun, borderRadius: radius.pill, paddingHorizontal: 24, paddingVertical: 11, shadowColor: '#C99A00', shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  paywallBtnText: { fontFamily: fonts.display, fontSize: font.body, color: colors.primaryInk },
});
