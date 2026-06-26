import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Check, Heart, Lightbulb, PencilLine, Sparkles, Target, Terminal, X } from 'lucide-react-native';
import type { LessonStep, PracticeStep, QuizStep, SetupStep, TheoryStep, TryStep } from '../lib/lesson-types';
import { Mascot, type MascotPose } from './mascot';
import { fonts } from '../lib/theme';

// Dark immersive lesson palette (matches the .dc.html lesson player).
const D = {
  text: '#FFFFFF',
  dim: 'rgba(255,255,255,0.72)',
  accent: '#C8B2FB', // hero-200
  yellow: '#FFD43A',
  mono: '#FFE885',
  mint: '#14A871',
  mintBg: 'rgba(20,168,113,0.16)',
  berry: '#EE5A52',
  berryBg: 'rgba(238,90,82,0.16)',
  card: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.14)',
  chip: 'rgba(255,255,255,0.08)',
  track: 'rgba(255,255,255,0.12)',
  bgTop: '#2A1A52',
  bgBottom: '#15101F',
};

const POSE: Record<string, MascotPose> = {
  'mascot-read': 'read', 'mascot-point': 'point', 'mascot-think': 'read', 'mascot-celebrate': 'celebrate',
  'mascot-thumbsup': 'thumbsup', 'mascot-wave': 'wave', 'mascot-laptop': 'laptop', 'mascot-hello': 'hello',
};
const poseFor = (m: string): MascotPose => POSE[m] ?? 'read';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

export type CompleteResult = { xp: number; reason: string };

export function LessonRunner({ steps: rawSteps, onComplete, onExit }: { steps: LessonStep[]; onComplete: (perfect: boolean) => Promise<CompleteResult>; onExit: () => void }) {
  const insets = useSafeAreaInsets();
  const steps = useMemo<LessonStep[]>(() => rawSteps.map((s) => (s.type === 'quiz' ? { ...s, options: shuffle(s.options) } : s)), [rawSteps]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [finishing, setFinishing] = useState(false);

  const step = steps[index];
  const progress = (index / steps.length) * 100;
  const isDone = step.type === 'done';

  // Auto-complete when reaching the done step.
  useEffect(() => {
    if (step.type === 'done' && !result && !finishing) {
      setFinishing(true);
      onComplete(mistakes === 0).then((r) => { setResult(r); setFinishing(false); });
    }
  }, [step.type]); // eslint-disable-line react-hooks/exhaustive-deps

  function next() { setSelected(null); setChecked(false); if (index < steps.length - 1) setIndex(index + 1); }

  return (
    <LinearGradient colors={[D.bgTop, D.bgBottom]} style={styles.screen}>
      {isDone ? (
        <View style={styles.doneWrap}>
          <View style={styles.doneGlow} />
          <Mascot pose="celebrate" size={168} />
          <Text style={styles.doneTitle}>จบบทแล้ว!</Text>
          <Text style={styles.doneSub}>เก่งมาก — ทำต่อเลยพรุ่งนี้</Text>
          <View style={styles.doneChips}>
            <View style={[styles.doneChip, { backgroundColor: 'rgba(255,212,58,0.14)', borderColor: 'rgba(255,212,58,0.4)' }]}>
              <Text style={[styles.doneChipNum, { color: D.yellow }]}>+{result?.xp ?? 0}</Text>
              <Text style={styles.doneChipLabel}>XP</Text>
            </View>
            <View style={[styles.doneChip, { backgroundColor: 'rgba(20,168,113,0.14)', borderColor: 'rgba(20,168,113,0.4)' }]}>
              <Check size={22} color={D.mint} strokeWidth={3} />
              <Text style={styles.doneChipLabel}>สำเร็จ</Text>
            </View>
          </View>
          <Pressable style={styles.doneBtn} onPress={onExit} disabled={finishing}>
            <Text style={styles.doneBtnText}>เยี่ยม!</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* top bar */}
          <View style={[styles.topBar, { paddingTop: insets.top + spacing(8) }]}>
            <Pressable style={styles.iconBtn} onPress={onExit}><X size={18} color="#fff" strokeWidth={2.6} /></Pressable>
            <View style={styles.track}><View style={[styles.trackFill, { width: `${progress}%` }]} /></View>
            <View style={styles.heartWrap}>
              <Heart size={18} color={D.berry} fill={D.berry} />
              <Text style={styles.heartText}>{Math.max(0, 5 - mistakes)}</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {step.type === 'theory' && <Theory step={step} />}
            {step.type === 'quiz' && <Quiz step={step} selected={selected} checked={checked} onSelect={setSelected} />}
            {step.type === 'practice' && <Practice key={index} step={step} />}
            {step.type === 'setup' && <Setup step={step} />}
            {step.type === 'try' && <Try step={step} />}
          </ScrollView>

          {/* bottom action */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing(16) }]}>
            {step.type === 'quiz' && checked && (
              <View style={[styles.feedback, step.options[selected!]?.correct ? styles.feedbackOk : styles.feedbackBad]}>
                <Text style={[styles.feedbackTitle, { color: step.options[selected!]?.correct ? D.mint : D.berry }]}>
                  {step.options[selected!]?.correct ? 'ถูกต้อง!' : 'ยังไม่ถูก'}
                </Text>
                {(step.options[selected!]?.correct ? step.correctFeedback : step.incorrectFeedback) ? (
                  <Text style={styles.feedbackText}>{step.options[selected!]?.correct ? step.correctFeedback : step.incorrectFeedback}</Text>
                ) : null}
              </View>
            )}
            {(step.type === 'theory' || step.type === 'practice' || step.type === 'setup' || step.type === 'try') && (
              <PrimaryBtn label="ต่อไป" onPress={next} />
            )}
            {step.type === 'quiz' && !checked && (
              <PrimaryBtn label="ตรวจคำตอบ" disabled={selected === null} onPress={() => { setChecked(true); if (!step.options[selected!]?.correct) setMistakes((m) => m + 1); }} />
            )}
            {step.type === 'quiz' && checked && <PrimaryBtn label="ต่อไป" onPress={next} />}
          </View>
        </>
      )}
    </LinearGradient>
  );
}

function spacing(n: number) { return n; }

function PrimaryBtn({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.primaryBtn, disabled && { opacity: 0.4 }]}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.tag}>
      {icon}
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

function Theory({ step }: { step: TheoryStep }) {
  return (
    <View>
      <Tag icon={<BookOpen size={13} color={D.accent} />} label="ทฤษฎี" />
      <Text style={styles.title}>{step.title}</Text>
      <View style={styles.mascotWrap}><Mascot pose={poseFor(step.mascot)} size={124} /></View>
      <Text style={styles.bodyText}>
        {step.body.map((p, i) => (
          <Text key={i} style={p.bold ? styles.bold : undefined}>{p.text}</Text>
        ))}
      </Text>
      {step.example ? (
        <View style={styles.promptBox}>
          <View style={styles.promptHead}><Text style={styles.promptDot}>●</Text><Text style={styles.promptHeadText}>ตัวอย่าง PROMPT</Text></View>
          <Text style={styles.promptText}>{step.example}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Quiz({ step, selected, checked, onSelect }: { step: QuizStep; selected: number | null; checked: boolean; onSelect: (i: number) => void }) {
  return (
    <View>
      <Tag icon={<Target size={13} color={D.accent} />} label="ควิซ" />
      <Text style={styles.question}>{step.question}</Text>
      <View style={styles.options}>
        {step.options.map((opt, i) => {
          const sel = selected === i;
          const showOk = checked && opt.correct;
          const showBad = checked && sel && !opt.correct;
          return (
            <Pressable key={i} disabled={checked} onPress={() => onSelect(i)} style={[styles.option, sel && !checked && styles.optionSel, showOk && styles.optionOk, showBad && styles.optionBad]}>
              <Text style={styles.optionText}>{opt.text}</Text>
              {showOk ? <Check size={18} color={D.mint} strokeWidth={3} /> : showBad ? <X size={18} color={D.berry} strokeWidth={3} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Practice({ step }: { step: PracticeStep }) {
  const [draft, setDraft] = useState(step.starterPrompt);
  const edited = draft.trim() !== step.starterPrompt.trim() && draft.trim().length > 0;
  return (
    <View>
      <Tag icon={<PencilLine size={13} color={D.accent} />} label="ลงมือทำ" />
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.lead}>{step.instruction}</Text>
      <TextInput style={styles.textarea} value={draft} onChangeText={setDraft} multiline textAlignVertical="top" placeholder="พิมพ์คำตอบของคุณ..." placeholderTextColor="rgba(255,255,255,0.4)" />
      <View style={styles.checks}>
        {step.requirements?.map((r, i) => (
          <View key={i} style={styles.checkRow}>
            <View style={[styles.checkDot, edited && styles.checkDotOn]}>{edited ? <Check size={12} color="#fff" strokeWidth={3} /> : null}</View>
            <Text style={styles.checkLabel}>{r}</Text>
          </View>
        ))}
      </View>
      <View style={styles.aiReview}>
        <Sparkles size={15} color={D.accent} />
        <Text style={styles.aiReviewText}>ให้ AI รีวิวให้</Text>
        <Text style={styles.proTag}>PRO</Text>
      </View>
    </View>
  );
}

function Setup({ step }: { step: SetupStep }) {
  return (
    <View>
      <Tag icon={<Terminal size={13} color={D.accent} />} label="ติดตั้ง" />
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.lead}>{step.instruction}</Text>
      <View style={styles.checks}>
        {step.steps.map((s, i) => (
          <View key={i} style={styles.checkRow}>
            <Text style={styles.stepNum}>{i + 1}</Text>
            <Text style={styles.checkLabel}>{s}</Text>
          </View>
        ))}
      </View>
      {step.command ? (
        <View style={styles.promptBox}><Text style={styles.promptText}>{step.command}</Text></View>
      ) : null}
    </View>
  );
}

function Try({ step }: { step: TryStep }) {
  return (
    <View>
      <Tag icon={<Lightbulb size={13} color={D.accent} />} label="ลองใช้" />
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.lead}>{step.instruction}</Text>
      <View style={styles.promptBox}>
        <View style={styles.promptHead}><Text style={styles.promptDot}>●</Text><Text style={styles.promptHeadText}>ลองใช้</Text></View>
        <Text style={styles.promptText}>{step.example}</Text>
      </View>
      <View style={styles.checks}>
        {step.checks?.map((c, i) => (
          <View key={i} style={styles.checkRow}>
            <View style={styles.checkDot} />
            <Text style={styles.checkLabel}>{c}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 18, paddingBottom: 14 },
  iconBtn: { width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 11, borderRadius: 999, backgroundColor: D.track, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 999, backgroundColor: D.mint },
  heartWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  heartText: { fontFamily: fonts.display, fontSize: 15, color: '#fff' },
  body: { padding: 18, paddingTop: 6, flexGrow: 1 },

  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: D.chip, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 14 },
  tagText: { fontFamily: fonts.bodyBold, fontSize: 11, color: D.accent, letterSpacing: 0.5 },
  title: { fontFamily: fonts.display, fontSize: 24, color: D.text, lineHeight: 29 },
  lead: { fontFamily: fonts.bodyMedium, fontSize: 14, color: D.dim, marginTop: 6, lineHeight: 21 },
  mascotWrap: { alignItems: 'center', marginVertical: 14 },
  bodyText: { fontFamily: fonts.bodyRegular, fontSize: 15, color: 'rgba(255,255,255,0.86)', lineHeight: 25 },
  bold: { fontFamily: fonts.bodyBold, color: D.text },
  promptBox: { marginTop: 18, backgroundColor: 'rgba(0,0,0,0.28)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' },
  promptHead: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  promptDot: { color: '#FD9A3D', fontSize: 10 },
  promptHeadText: { fontFamily: fonts.bodyBold, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 },
  promptText: { fontFamily: 'monospace', fontSize: 12.5, lineHeight: 21, color: D.mono, padding: 14 },

  question: { fontFamily: fonts.display, fontSize: 20, color: D.text, lineHeight: 27, marginBottom: 18 },
  options: { gap: 11 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, backgroundColor: D.card, borderWidth: 1.5, borderColor: D.cardBorder, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 15 },
  optionSel: { borderColor: D.accent, backgroundColor: 'rgba(200,178,251,0.12)' },
  optionOk: { borderColor: D.mint, backgroundColor: D.mintBg },
  optionBad: { borderColor: D.berry, backgroundColor: D.berryBg },
  optionText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 14.5, color: D.text, lineHeight: 21 },

  textarea: { marginTop: 14, minHeight: 118, backgroundColor: 'rgba(0,0,0,0.28)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: 14, color: '#fff', fontFamily: 'monospace', fontSize: 13, lineHeight: 21 },
  checks: { marginTop: 14, gap: 10 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  checkDotOn: { backgroundColor: D.mint, borderColor: D.mint },
  checkLabel: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 13, color: D.dim },
  stepNum: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.14)', color: '#fff', fontFamily: fonts.bodyBold, fontSize: 11, textAlign: 'center', lineHeight: 20, overflow: 'hidden' },
  aiReview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, backgroundColor: 'rgba(108,60,245,0.22)', borderWidth: 1.5, borderColor: D.accent, borderRadius: 16, paddingVertical: 13 },
  aiReviewText: { fontFamily: fonts.display, fontSize: 14, color: D.accent },
  proTag: { fontFamily: fonts.bodyBold, fontSize: 10, color: '#481FB8', backgroundColor: D.yellow, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, overflow: 'hidden', letterSpacing: 0.5 },

  footer: { paddingHorizontal: 18, paddingTop: 8 },
  feedback: { borderRadius: 14, padding: 14, marginBottom: 12 },
  feedbackOk: { backgroundColor: D.mintBg },
  feedbackBad: { backgroundColor: D.berryBg },
  feedbackTitle: { fontFamily: fonts.display, fontSize: 16 },
  feedbackText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: 'rgba(255,255,255,0.78)', marginTop: 5, lineHeight: 20 },
  primaryBtn: { backgroundColor: D.yellow, borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#C99A00', shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  primaryBtnText: { fontFamily: fonts.display, fontSize: 16, color: '#481FB8' },

  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  doneGlow: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(255,212,58,0.18)', top: '24%' },
  doneTitle: { fontFamily: fonts.display, fontSize: 26, color: '#fff', marginTop: 8 },
  doneSub: { fontFamily: fonts.bodyMedium, fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  doneChips: { flexDirection: 'row', gap: 12, marginTop: 24 },
  doneChip: { borderWidth: 1, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 22, alignItems: 'center', minWidth: 96 },
  doneChipNum: { fontFamily: fonts.display, fontSize: 24 },
  doneChipLabel: { fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5, marginTop: 2 },
  doneBtn: { marginTop: 30, backgroundColor: D.yellow, borderRadius: 18, paddingVertical: 15, paddingHorizontal: 40, shadowColor: '#C99A00', shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  doneBtnText: { fontFamily: fonts.display, fontSize: 16, color: '#481FB8' },
});
