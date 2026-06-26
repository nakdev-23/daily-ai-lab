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
