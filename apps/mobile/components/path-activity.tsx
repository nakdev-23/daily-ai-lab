import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flag, Sparkles, Wrench, X } from 'lucide-react-native';
import { Mascot } from './mascot';
import { useAuth } from '../lib/auth';
import {
  completeLesson,
  getPathSubmission,
  savePathSubmission,
  type PathStep,
} from '../lib/data';
import { Button } from './ui';
import { colors, fonts, font, radius, shadow, spacing } from '../lib/theme';

const MIN_CHARS = 40; // path_submissions.content DB check

/**
 * Checkpoint/Project activity: the learner submits a written deliverable graded
 * against a rubric. Mirrors the web PathActivity (minus the Pro AI review). On
 * submit it saves to path_submissions and completes the path step for XP.
 */
export function PathActivity({
  step,
  pathId,
  pathSlug,
  stepNum,
  onExit,
}: {
  step: PathStep;
  pathId: string;
  pathSlug: string;
  stepNum: number;
  onExit: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { session, refreshProfile } = useAuth();
  const kind = step.kind === 'project' ? 'project' : 'checkpoint';

  const [content, setContent] = useState(step.starterTemplate ?? '');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ xp: number; reason: string } | null>(null);

  useEffect(() => {
    let alive = true;
    getPathSubmission(step.id).then((sub) => {
      if (alive) {
        if (sub?.content) setContent(sub.content);
        setLoaded(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [step.id]);

  async function submit() {
    setError(null);
    if (content.trim().length < MIN_CHARS) {
      setError(`เขียนงานให้ยาวอย่างน้อย ${MIN_CHARS} ตัวอักษรก่อนส่ง`);
      return;
    }
    if (!session?.user) {
      setError('กรุณาเข้าสู่ระบบ');
      return;
    }
    setSaving(true);
    const save = await savePathSubmission({
      userId: session.user.id,
      pathId,
      stepId: step.id,
      kind,
      artifactTitle: step.deliverable || step.title,
      content,
    });
    if (save.error) {
      setSaving(false);
      setError(save.error);
      return;
    }
    const res = await completeLesson(`path:${pathSlug}`, stepNum, true);
    await refreshProfile();
    setSaving(false);
    setResult({ xp: res.xp, reason: res.reason });
  }

  const BadgeIcon = kind === 'project' ? Wrench : Flag;
  const badgeLabel = kind === 'project' ? 'โปรเจกต์' : 'จุดตรวจ';

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top + spacing.sm }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={12}>
          <X size={22} color={colors.textMuted} />
        </Pressable>
        <View style={styles.badgeRow}>
          <BadgeIcon size={15} color={colors.accent} />
          <Text style={styles.badge}>{badgeLabel}</Text>
        </View>
        <Text style={styles.xp}>+{step.xp} XP</Text>
      </View>

      {result ? (
        <View style={styles.doneWrap}>
          <Mascot pose="celebrate" size={120} />
          <Text style={styles.doneTitle}>ส่งงานแล้ว!</Text>
          <Text style={styles.doneXp}>
            {result.reason === 'replay'
              ? 'อัปเดตงานเรียบร้อย'
              : result.xp > 0
                ? `+${result.xp} XP`
                : 'บันทึกแล้ว'}
          </Text>
          {step.isPortfolio ? (
            <View style={styles.portfolioRow}>
              <Sparkles size={15} color={colors.sunDeep} fill={colors.sun} />
              <Text style={styles.portfolioNote}>งานนี้ถูกเก็บเข้าพอร์ตของคุณ</Text>
            </View>
          ) : null}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{step.title}</Text>

          {step.brief ? (
            <View style={styles.briefBox}>
              <Text style={styles.sectionLabel}>โจทย์</Text>
              <Text style={styles.briefText}>{step.brief}</Text>
            </View>
          ) : null}

          {step.deliverable ? (
            <View style={styles.deliverBox}>
              <Text style={styles.sectionLabel}>สิ่งที่ต้องส่ง</Text>
              <Text style={styles.deliverText}>{step.deliverable}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionLabel}>งานของคุณ</Text>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholder="เขียนงานของคุณที่นี่..."
            placeholderTextColor={colors.textFaint}
          />
          <Text style={styles.counter}>
            {content.trim().length}/{MIN_CHARS} ตัวอักษรขั้นต่ำ
          </Text>

          {step.rubric?.length ? (
            <View style={styles.rubricBox}>
              <Text style={styles.sectionLabel}>เกณฑ์ให้คะแนน</Text>
              {step.rubric.map((c) => (
                <View key={c.key} style={styles.rubricRow}>
                  <Text style={styles.rubricLabel}>• {c.label}</Text>
                  <Text style={styles.rubricGuide}>{c.guidance}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {result ? (
          <Button label="เสร็จสิ้น" onPress={onExit} />
        ) : (
          <Button
            label={loaded ? 'ส่งงาน & รับ XP' : 'กำลังโหลด...'}
            onPress={submit}
            loading={saving}
            disabled={!loaded}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  badgeRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  badge: { color: colors.primary, fontSize: font.small, fontFamily: fonts.bodyBold },
  xp: { color: colors.primary, fontSize: font.small, fontFamily: fonts.display },
  body: { padding: spacing.lg, gap: spacing.md },
  title: { color: colors.text, fontSize: font.h2, fontFamily: fonts.display },
  sectionLabel: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyBold, letterSpacing: 0.4, textTransform: 'uppercase' },
  briefBox: { backgroundColor: colors.heroTint, borderRadius: radius.md, padding: spacing.lg, gap: 6 },
  briefText: { color: colors.text, fontSize: font.body, fontFamily: fonts.bodyMedium, lineHeight: 24 },
  deliverBox: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, gap: 6, ...shadow.soft },
  deliverText: { color: colors.body, fontSize: font.small, fontFamily: fonts.bodyRegular, lineHeight: 22 },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    fontSize: font.body,
    fontFamily: fonts.bodyRegular,
    minHeight: 220,
    lineHeight: 22,
  },
  counter: { color: colors.textFaint, fontSize: font.tiny, fontFamily: fonts.bodyMedium, textAlign: 'right' },
  rubricBox: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm, ...shadow.soft },
  rubricRow: { gap: 2 },
  rubricLabel: { color: colors.text, fontSize: font.small, fontFamily: fonts.bodyBold },
  rubricGuide: { color: colors.textMuted, fontSize: font.tiny, fontFamily: fonts.bodyRegular, lineHeight: 18 },
  error: { color: colors.danger, fontSize: font.small, fontFamily: fonts.bodyMedium },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl },
  doneEmoji: { fontSize: 76 },
  doneTitle: { color: colors.text, fontSize: font.h1, fontFamily: fonts.display },
  doneXp: { color: colors.primary, fontSize: font.h3, fontFamily: fonts.display },
  portfolioRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  portfolioNote: { color: colors.primaryInk, fontSize: font.small, fontFamily: fonts.bodyBold },
});
