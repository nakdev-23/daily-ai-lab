import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../lib/auth';
import { completeLesson, getCareerPath, type CareerPath, type PathStep } from '../../../lib/data';
import { loadCareerLesson } from '../../../lib/lesson-content';
import type { LessonStep } from '../../../lib/lesson-types';
import { LessonRunner } from '../../../components/lesson-runner';
import { PathActivity } from '../../../components/path-activity';
import { Button, Loading } from '../../../components/ui';
import { colors, font, spacing } from '../../../lib/theme';

export default function PathStepPlayer() {
  const { id, step } = useLocalSearchParams<{ id: string; step: string }>();
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const stepNum = parseInt(step ?? '1', 10);

  const [path, setPath] = useState<CareerPath | null>(null);
  const [pathStep, setPathStep] = useState<PathStep | null>(null);
  const [steps, setSteps] = useState<LessonStep[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await getCareerPath(id ?? '');
      const flat = p?.modules.flatMap((m) => m.steps) ?? [];
      const ps = flat[stepNum - 1] ?? null;
      // Lesson/quiz steps load content; checkpoint/project render the activity UI.
      const content =
        ps && ps.kind !== 'checkpoint' && ps.kind !== 'project'
          ? loadCareerLesson(p!.slug, stepNum, ps.courseSlug, ps.lessonNum)
          : null;
      if (alive) {
        setPath(p);
        setPathStep(ps);
        setSteps(content);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, stepNum]);

  if (loading) return <Loading label="กำลังโหลด..." />;

  if (!path || !pathStep) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>ไม่พบขั้นตอนนี้</Text>
        <Button label="กลับ" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  // Checkpoint / project → deliverable submission with rubric.
  if (pathStep.kind === 'checkpoint' || pathStep.kind === 'project') {
    return (
      <PathActivity
        step={pathStep}
        pathId={path.id}
        pathSlug={path.slug}
        stepNum={stepNum}
        onExit={() => router.back()}
      />
    );
  }

  if (!steps) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>ยังไม่มีเนื้อหาขั้นตอนนี้ในแอป</Text>
        <Button label="กลับ" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <LessonRunner
      steps={steps}
      onExit={() => router.back()}
      onComplete={async (perfect) => {
        const res = await completeLesson(`path:${path.slug}`, stepNum, perfect);
        await refreshProfile();
        return { xp: res.xp, reason: res.reason };
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, backgroundColor: colors.bg, padding: spacing.xl },
  muted: { color: colors.textMuted, fontSize: font.body },
});
