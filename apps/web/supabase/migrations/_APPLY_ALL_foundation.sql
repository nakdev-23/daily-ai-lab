-- ============================================================================
-- Daily AI Lab — Feature foundation (combined)
-- Applies migrations 023 + 024 + 025 in one file, in dependency order.
--
-- Run this in the Supabase SQL editor. Idempotent + safe to re-run.
-- Creates: lesson_feedback, certificates (+ auto-issue trigger), and
-- path_submissions (the table the checkpoint/project SAVE needs).
-- PRECONDITION: base schema already exists (career_paths, path_steps,
-- path_modules, course_progress, profiles, is_admin()). 024 enables pgcrypto,
-- which 025 relies on, so keep this order.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 023 · Lesson feedback (lesson_feedback table)
-- ---------------------------------------------------------------------------
-- Migration 023: Lesson feedback — collect a rating + optional comment per lesson
-- After finishing a lesson the learner can rate it (1–5) and leave a short note.
-- One row per (user, course, lesson); re-submitting overwrites the previous one
-- (upsert), so the table always holds each learner's latest opinion of a lesson.
-- Admins read everything (to spot weak lessons); learners only see their own.
-- Run this in Supabase SQL Editor (safe to re-run).

create table if not exists lesson_feedback (
  user_id    uuid not null references auth.users(id) on delete cascade,
  course_id  text not null,                          -- matches courses.slug / path key
  lesson_num int  not null,
  rating     int  not null check (rating between 1 and 5),
  comment    text check (comment is null or char_length(comment) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id, lesson_num)
);

-- Browse feedback for a lesson (admin reporting) without scanning the whole table.
create index if not exists lesson_feedback_lesson_idx
  on lesson_feedback (course_id, lesson_num, created_at desc);

alter table lesson_feedback enable row level security;

-- Drop-then-create so the policy block is idempotent (CREATE POLICY has no
-- IF NOT EXISTS — a plain re-run would otherwise fail with "already exists").
drop policy if exists "users read own feedback"   on lesson_feedback;
drop policy if exists "users insert own feedback" on lesson_feedback;
drop policy if exists "users update own feedback" on lesson_feedback;
drop policy if exists "admins read all feedback"  on lesson_feedback;

-- Learners manage only their own feedback.
create policy "users read own feedback"   on lesson_feedback for select using (auth.uid() = user_id);
create policy "users insert own feedback" on lesson_feedback for insert with check (auth.uid() = user_id);
create policy "users update own feedback" on lesson_feedback for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Admins can read all feedback to find lessons that need work.
create policy "admins read all feedback" on lesson_feedback for select using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 024 · Certificates (certificates table + auto-issue trigger + verify RPC)
-- ---------------------------------------------------------------------------
-- Migration 024: verifiable career-path certificates
-- A certificate is issued automatically when course_progress reaches the final
-- step of a published career path. The trigger runs in the same transaction as
-- complete_lesson, so progress and certificate issuance cannot drift apart.
--
-- Public visitors never receive user_id or other private profile fields. They
-- verify a certificate through verify_certificate(code), which returns only
-- the immutable certificate snapshot needed on the public verification page.
-- Safe to re-run.

create extension if not exists pgcrypto;

create table if not exists certificates (
  id                bigint generated always as identity primary key,
  verification_code text not null default (
    'DAL-' || upper(encode(gen_random_bytes(10), 'hex'))
  ),
  user_id           uuid not null references auth.users(id) on delete cascade,
  path_id           uuid not null references career_paths(id) on delete restrict,
  path_slug         text not null,
  recipient_name    text not null,
  path_title        text not null,
  path_title_en     text,
  completed_steps   int not null check (completed_steps > 0),
  total_xp          int not null default 0 check (total_xp >= 0),
  issued_at         timestamptz not null default now(),
  revoked_at        timestamptz,
  revoke_reason     text,
  constraint certificates_verification_code_key unique (verification_code),
  constraint certificates_user_path_key unique (user_id, path_id),
  constraint certificates_code_format check (
    verification_code ~ '^DAL-[A-F0-9]{20}$'
  )
);

create index if not exists certificates_user_issued_idx
  on certificates (user_id, issued_at desc);

create index if not exists certificates_path_issued_idx
  on certificates (path_id, issued_at desc);

alter table certificates enable row level security;

drop policy if exists "users read own certificates" on certificates;
create policy "users read own certificates"
  on certificates for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "admins read all certificates" on certificates;
create policy "admins read all certificates"
  on certificates for select to authenticated
  using ((select is_admin((select auth.uid()))));

-- The browser must not query certificate rows directly. Public verification
-- goes through the limited RPC below.
revoke all on table certificates from anon;
grant select on table certificates to authenticated;

create or replace function issue_path_certificate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path_slug   text;
  v_path        career_paths%rowtype;
  v_step_count  int;
  v_total_xp    int;
  v_name        text;
begin
  if new.course_id not like 'path:%' then
    return new;
  end if;

  v_path_slug := substring(new.course_id from 6);

  select cp.*
    into v_path
  from career_paths cp
  where cp.slug = v_path_slug
    and cp.is_published = true;

  if not found then
    return new;
  end if;

  select count(*)::int, coalesce(sum(ps.xp), 0)::int
    into v_step_count, v_total_xp
  from path_steps ps
  join path_modules pm on pm.id = ps.module_id
  where pm.path_id = v_path.id;

  if v_step_count = 0 or new.lessons_done < v_step_count then
    return new;
  end if;

  select nullif(trim(p.display_name), '')
    into v_name
  from profiles p
  where p.id = new.user_id;

  insert into certificates (
    user_id,
    path_id,
    path_slug,
    recipient_name,
    path_title,
    path_title_en,
    completed_steps,
    total_xp
  )
  values (
    new.user_id,
    v_path.id,
    v_path.slug,
    coalesce(v_name, 'Daily AI Lab Learner'),
    v_path.title,
    v_path.title_en,
    v_step_count,
    v_total_xp
  )
  on conflict (user_id, path_id) do nothing;

  return new;
end;
$$;

revoke all on function issue_path_certificate() from public;

drop trigger if exists issue_path_certificate_after_progress on course_progress;
create trigger issue_path_certificate_after_progress
  after insert or update of lessons_done on course_progress
  for each row execute function issue_path_certificate();

-- Issue certificates retroactively for paths completed before this migration.
insert into certificates (
  user_id,
  path_id,
  path_slug,
  recipient_name,
  path_title,
  path_title_en,
  completed_steps,
  total_xp,
  issued_at
)
select
  progress.user_id,
  progress.path_id,
  progress.path_slug,
  coalesce(nullif(trim(p.display_name), ''), 'Daily AI Lab Learner'),
  progress.path_title,
  progress.path_title_en,
  progress.step_count,
  progress.total_xp,
  coalesce(progress.updated_at, now())
from (
  select
    cpgr.user_id,
    cp.id as path_id,
    cp.slug as path_slug,
    cp.title as path_title,
    cp.title_en as path_title_en,
    count(ps.id)::int as step_count,
    coalesce(sum(ps.xp), 0)::int as total_xp,
    cpgr.lessons_done,
    cpgr.updated_at
  from course_progress cpgr
  join career_paths cp
    on cp.slug = substring(cpgr.course_id from 6)
   and cp.is_published = true
  join path_modules pm on pm.path_id = cp.id
  join path_steps ps on ps.module_id = pm.id
  where cpgr.course_id like 'path:%'
  group by
    cpgr.user_id,
    cpgr.lessons_done,
    cpgr.updated_at,
    cp.id,
    cp.slug,
    cp.title,
    cp.title_en
) progress
join profiles p on p.id = progress.user_id
where progress.step_count > 0
  and progress.lessons_done >= progress.step_count
on conflict (user_id, path_id) do nothing;

create or replace function verify_certificate(p_code text)
returns table (
  verification_code text,
  recipient_name text,
  path_title text,
  path_title_en text,
  path_slug text,
  completed_steps int,
  total_xp int,
  issued_at timestamptz,
  valid boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.verification_code,
    c.recipient_name,
    c.path_title,
    c.path_title_en,
    c.path_slug,
    c.completed_steps,
    c.total_xp,
    c.issued_at,
    c.revoked_at is null as valid
  from certificates c
  where c.verification_code = upper(trim(p_code))
  limit 1;
$$;

revoke all on function verify_certificate(text) from public;
grant execute on function verify_certificate(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 025 · Learning projects (path_submissions table + rubric/template backfill)
-- ---------------------------------------------------------------------------
-- Migration 025: practice-led learning, assessed path projects, and portfolio artifacts
-- Run after 024_certificates.sql. Safe to re-run.

alter table path_steps add column if not exists brief text;
alter table path_steps add column if not exists brief_en text;
alter table path_steps add column if not exists deliverable text;
alter table path_steps add column if not exists deliverable_en text;
alter table path_steps add column if not exists starter_template text;
alter table path_steps add column if not exists starter_template_en text;
alter table path_steps add column if not exists rubric jsonb not null default '[]'::jsonb;
alter table path_steps add column if not exists is_portfolio boolean not null default false;

create table if not exists path_submissions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  path_id        uuid not null references career_paths(id) on delete cascade,
  step_id        uuid not null references path_steps(id) on delete cascade,
  kind           text not null check (kind in ('checkpoint', 'project')),
  artifact_title text not null check (char_length(artifact_title) between 3 and 120),
  content        text not null check (char_length(content) between 40 and 20000),
  self_scores    jsonb not null default '{}'::jsonb,
  feedback       jsonb not null default '{}'::jsonb,
  status         text not null default 'submitted' check (status in ('submitted', 'reviewed')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint path_submissions_user_step_key unique (user_id, step_id)
);

create index if not exists path_submissions_user_updated_idx
  on path_submissions (user_id, updated_at desc);

create index if not exists path_submissions_path_idx
  on path_submissions (path_id, updated_at desc);

alter table path_submissions enable row level security;

create or replace function validate_path_submission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kind text;
begin
  select ps.kind
    into v_kind
  from path_steps ps
  join path_modules pm on pm.id = ps.module_id
  join career_paths cp on cp.id = pm.path_id
  where ps.id = new.step_id
    and pm.path_id = new.path_id
    and cp.is_published = true
    and ps.kind in ('checkpoint', 'project');

  if v_kind is null then
    raise exception 'invalid path submission target';
  end if;

  new.kind := v_kind;
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function validate_path_submission() from public;

drop trigger if exists validate_path_submission_before_write on path_submissions;
create trigger validate_path_submission_before_write
  before insert or update on path_submissions
  for each row execute function validate_path_submission();

drop policy if exists "users manage own path submissions" on path_submissions;
create policy "users manage own path submissions"
  on path_submissions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "admins read path submissions" on path_submissions;
create policy "admins read path submissions"
  on path_submissions for select to authenticated
  using ((select is_admin((select auth.uid()))));

-- Every published path must end with at least one tangible artifact. To avoid
-- invalidating existing progress, promote an existing checkpoint (or the final
-- step) instead of inserting a new step and shifting step counts.
with missing as (
  select cp.id as path_id
  from career_paths cp
  where cp.is_published = true
    and not exists (
      select 1
      from path_modules pm
      join path_steps ps on ps.module_id = pm.id
      where pm.path_id = cp.id and ps.kind = 'project'
    )
),
candidates as (
  select distinct on (pm.path_id)
    ps.id,
    cp.title as path_title,
    cp.title_en as path_title_en
  from missing x
  join career_paths cp on cp.id = x.path_id
  join path_modules pm on pm.path_id = cp.id
  join path_steps ps on ps.module_id = pm.id
  order by
    pm.path_id,
    case when ps.kind = 'checkpoint' then 0 else 1 end,
    pm.order_index desc,
    ps.order_index desc
)
update path_steps ps
set
  kind = 'project',
  title = 'Final project: ' || candidates.path_title,
  title_en = 'Final project: ' || coalesce(candidates.path_title_en, candidates.path_title)
from candidates
where ps.id = candidates.id;

-- Apply a consistent assessment contract to every checkpoint and project.
update path_steps ps
set
  brief = coalesce(
    ps.brief,
    case ps.kind
      when 'project' then 'สร้างชิ้นงานที่นำไปใช้จริงจากทักษะใน ' || cp.title || ' อธิบายโจทย์ ผู้ใช้เป้าหมาย และวิธีตรวจคุณภาพก่อนส่ง'
      else 'ทดลองใช้ทักษะจากบทนี้กับสถานการณ์จริง แล้วปรับคำตอบจนผ่านเกณฑ์ประเมินทั้ง 4 ด้าน'
    end
  ),
  brief_en = coalesce(
    ps.brief_en,
    case ps.kind
      when 'project' then 'Create a real, reusable artifact using the skills from ' || coalesce(cp.title_en, cp.title) || '. Explain the goal, audience, and how you verified the result.'
      else 'Apply this skill to a realistic scenario and improve the result until it meets all four rubric criteria.'
    end
  ),
  deliverable = coalesce(
    ps.deliverable,
    case ps.kind
      when 'project' then 'ชิ้นงานฉบับพร้อมใช้ พร้อม prompt หลัก ขั้นตอนใช้งาน และ checklist ตรวจงาน'
      else 'prompt ฉบับปรับปรุง พร้อมคำอธิบายสั้น ๆ ว่าปรับอะไรและเพราะอะไร'
    end
  ),
  deliverable_en = coalesce(
    ps.deliverable_en,
    case ps.kind
      when 'project' then 'A ready-to-use artifact with its core prompt, usage steps, and quality checklist.'
      else 'An improved prompt plus a short explanation of what you changed and why.'
    end
  ),
  starter_template = coalesce(
    ps.starter_template,
    'เป้าหมายของงาน:' || E'\n' ||
    'กลุ่มผู้ใช้/ผู้รับสาร:' || E'\n' ||
    'บริบทที่ AI ต้องรู้:' || E'\n' ||
    'Prompt ที่ใช้:' || E'\n' ||
    'รูปแบบผลลัพธ์ที่ต้องการ:' || E'\n' ||
    'วิธีตรวจข้อเท็จจริง/คุณภาพ:' || E'\n' ||
    'ชิ้นงานฉบับสุดท้าย:'
  ),
  starter_template_en = coalesce(
    ps.starter_template_en,
    'Goal:' || E'\n' ||
    'Audience:' || E'\n' ||
    'Context the AI needs:' || E'\n' ||
    'Prompt used:' || E'\n' ||
    'Required output format:' || E'\n' ||
    'Fact/quality checks:' || E'\n' ||
    'Final artifact:'
  ),
  rubric = case
    when jsonb_array_length(ps.rubric) > 0 then ps.rubric
    else jsonb_build_array(
      jsonb_build_object(
        'key', 'clarity',
        'label', 'ความชัดเจน',
        'label_en', 'Clarity',
        'guidance', 'ระบุเป้าหมายและสิ่งที่ต้องการให้ AI ทำอย่างเจาะจง',
        'guidance_en', 'The goal and requested action are specific.'
      ),
      jsonb_build_object(
        'key', 'context',
        'label', 'บริบท',
        'label_en', 'Context',
        'guidance', 'ให้ข้อมูลผู้ใช้เป้าหมาย ข้อจำกัด และข้อมูลสำคัญเพียงพอ',
        'guidance_en', 'Audience, constraints, and relevant background are included.'
      ),
      jsonb_build_object(
        'key', 'format',
        'label', 'รูปแบบ',
        'label_en', 'Format',
        'guidance', 'กำหนดโครงสร้าง ความยาว น้ำเสียง หรือรูปแบบส่งมอบชัดเจน',
        'guidance_en', 'Structure, length, tone, or delivery format is explicit.'
      ),
      jsonb_build_object(
        'key', 'fact_check',
        'label', 'การตรวจข้อเท็จจริง',
        'label_en', 'Fact checking',
        'guidance', 'บอกวิธีตรวจแหล่งข้อมูล ตัวเลข สมมติฐาน และจุดที่ AI อาจแต่งขึ้น',
        'guidance_en', 'Sources, numbers, assumptions, and possible hallucinations are checked.'
      )
    )
  end,
  is_portfolio = ps.kind = 'project'
from path_modules pm
join career_paths cp on cp.id = pm.path_id
where ps.module_id = pm.id
  and ps.kind in ('checkpoint', 'project');

