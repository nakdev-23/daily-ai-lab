import { supabase } from './supabase';

export type GameState = {
  xp: number;
  level: number;
  hearts: number;
  streak_current: number;
  streak_longest: number;
  lessons_today: number;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tool: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: string;
  units: number;
  lessons: number;
  order_index: number;
  is_pro: boolean;
  show_in_daily?: boolean;
};

export type LeaderboardRow = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_current: number;
  rank: number;
};

export type CompleteLessonResult = {
  ok: boolean;
  xp: number;
  reason: 'ok' | 'replay' | 'sequential' | 'daily-limit' | 'invalid' | 'not-signed-in' | 'error';
};

const DEFAULT_GAME_STATE: GameState = {
  xp: 0,
  level: 1,
  hearts: 5,
  streak_current: 0,
  streak_longest: 0,
  lessons_today: 0,
};

export async function getGameState(userId: string): Promise<GameState> {
  const { data } = await supabase
    .from('game_state')
    .select('xp, level, hearts, streak_current, streak_longest, lessons_today')
    .eq('user_id', userId)
    .maybeSingle();
  return { ...DEFAULT_GAME_STATE, ...(data ?? {}) } as GameState;
}

/** Published courses (RLS on the anon client filters to published rows). */
export async function getCourses(): Promise<Course[]> {
  const { data } = await supabase
    .from('courses')
    .select('*')
    .order('order_index', { ascending: true });
  return ((data as Course[]) ?? []).filter((c) => c.status === 'published' || !c.status);
}

export async function getCourse(slug: string): Promise<Course | null> {
  const { data } = await supabase.from('courses').select('*').eq('slug', slug).maybeSingle();
  return (data as Course) ?? null;
}

/** Map of course slug → lessons completed, for the signed-in user. */
export async function getCourseProgress(userId: string): Promise<Record<string, number>> {
  const { data } = await supabase
    .from('course_progress')
    .select('course_id, lessons_done')
    .eq('user_id', userId);
  const out: Record<string, number> = {};
  for (const row of (data as { course_id: string; lessons_done: number }[]) ?? []) {
    out[row.course_id] = row.lessons_done;
  }
  return out;
}

export async function getLessonsDone(userId: string, courseId: string): Promise<number> {
  const { data } = await supabase
    .from('course_progress')
    .select('lessons_done')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
  return (data?.lessons_done as number) ?? 0;
}

export type RubricCriterion = {
  key: string;
  label: string;
  guidance: string;
};

export type PathStep = {
  id: string;
  title: string;
  kind: 'lesson' | 'quiz' | 'checkpoint' | 'project';
  courseSlug: string;
  lessonNum: number;
  xp: number;
  brief: string | null;
  deliverable: string | null;
  starterTemplate: string | null;
  rubric: RubricCriterion[];
  isPortfolio: boolean;
};

export type PathSubmission = {
  id: string;
  stepId: string;
  artifactTitle: string;
  content: string;
  updatedAt: string;
};

export type PathModule = {
  id: string;
  title: string;
  steps: PathStep[];
};

export type CareerPath = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  description: string;
  tone: string;
  tools: string[];
  weeks: number;
  is_pro: boolean;
  is_published: boolean;
  modules: PathModule[];
};

/** List of published paths (without modules) for the Paths tab. */
export async function getCareerPaths(): Promise<CareerPath[]> {
  const { data } = await supabase
    .from('career_paths')
    .select('id, slug, title, tag, description, tone, tools, weeks, is_pro, is_published')
    .order('order_index');
  return ((data as CareerPath[]) ?? []).map((p) => ({ ...p, modules: [] }));
}

/** One path with its modules + steps (mirrors web getCareerPath). */
export async function getCareerPath(slug: string): Promise<CareerPath | null> {
  const { data: p } = await supabase.from('career_paths').select('*').eq('slug', slug).maybeSingle();
  if (!p) return null;

  const { data: mods } = await supabase
    .from('path_modules')
    .select('*')
    .eq('path_id', (p as { id: string }).id)
    .order('order_index');
  const moduleIds = ((mods as { id: string }[]) ?? []).map((m) => m.id);

  const { data: steps } = moduleIds.length
    ? await supabase.from('path_steps').select('*').in('module_id', moduleIds).order('order_index')
    : { data: [] as unknown[] };

  const stepsByModule = new Map<string, PathStep[]>();
  for (const s of (steps as Record<string, unknown>[]) ?? []) {
    const mid = s.module_id as string;
    if (!stepsByModule.has(mid)) stepsByModule.set(mid, []);
    stepsByModule.get(mid)!.push({
      id: s.id as string,
      title: s.title as string,
      kind: (s.kind as PathStep['kind']) ?? 'lesson',
      courseSlug: s.course_slug as string,
      lessonNum: s.lesson_num as number,
      xp: (s.xp as number) ?? 0,
      brief: (s.brief as string) ?? null,
      deliverable: (s.deliverable as string) ?? null,
      starterTemplate: (s.starter_template as string) ?? null,
      rubric: (s.rubric as RubricCriterion[]) ?? [],
      isPortfolio: Boolean(s.is_portfolio),
    });
  }

  const modules: PathModule[] = ((mods as Record<string, unknown>[]) ?? []).map((m) => ({
    id: m.id as string,
    title: m.title as string,
    steps: stepsByModule.get(m.id as string) ?? [],
  }));

  return {
    id: (p as Record<string, unknown>).id as string,
    slug: (p as Record<string, unknown>).slug as string,
    title: (p as Record<string, unknown>).title as string,
    tag: ((p as Record<string, unknown>).tag as string) ?? '',
    description: ((p as Record<string, unknown>).description as string) ?? '',
    tone: ((p as Record<string, unknown>).tone as string) ?? 'violet',
    tools: ((p as Record<string, unknown>).tools as string[]) ?? [],
    weeks: ((p as Record<string, unknown>).weeks as number) ?? 0,
    is_pro: Boolean((p as Record<string, unknown>).is_pro),
    is_published: Boolean((p as Record<string, unknown>).is_published),
    modules,
  };
}

export async function getPathSubmission(stepId: string): Promise<PathSubmission | null> {
  const { data } = await supabase
    .from('path_submissions')
    .select('id, step_id, artifact_title, content, updated_at')
    .eq('step_id', stepId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id as string,
    stepId: data.step_id as string,
    artifactTitle: data.artifact_title as string,
    content: data.content as string,
    updatedAt: data.updated_at as string,
  };
}

/** Upsert a checkpoint/project submission. content must be 40–20000 chars (DB check). */
export async function savePathSubmission(args: {
  userId: string;
  pathId: string;
  stepId: string;
  kind: 'checkpoint' | 'project';
  artifactTitle: string;
  content: string;
}): Promise<{ error?: string }> {
  const { error } = await supabase.from('path_submissions').upsert(
    {
      user_id: args.userId,
      path_id: args.pathId,
      step_id: args.stepId,
      kind: args.kind,
      artifact_title: args.artifactTitle.slice(0, 120),
      content: args.content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,step_id' },
  );
  return error ? { error: error.message } : {};
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardRow[]> {
  const { data } = await supabase.rpc('get_leaderboard', { limit_count: limit });
  return (data as LeaderboardRow[]) ?? [];
}

/**
 * Server owns the XP amount (reads lesson XP server-side). Idempotent: replaying
 * a finished lesson awards nothing. Mirrors apps/web/lib/progress.ts.
 */
export async function completeLesson(
  courseId: string,
  lessonNum: number,
  perfect = false,
): Promise<CompleteLessonResult> {
  const { data, error } = await supabase.rpc('complete_lesson', {
    p_course_id: courseId,
    p_lesson_num: lessonNum,
    p_perfect: perfect,
  });
  if (error || !data || typeof data !== 'object') return { ok: false, xp: 0, reason: 'error' };
  const r = data as { ok?: boolean; xp?: number; reason?: string };
  return {
    ok: r.ok === true,
    xp: typeof r.xp === 'number' ? r.xp : 0,
    reason: (r.reason as CompleteLessonResult['reason']) ?? 'error',
  };
}
